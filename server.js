const express = require('express');
const cors = require('cors');
const { Resend } = require('resend');
const path = require('path');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const xss = require('xss-clean');
const hpp = require('hpp');
const mongoSanitize = require('express-mongo-sanitize');
require('dotenv').config();

// Validate environment variables
const validateEnv = () => {
    const requiredEnvVars = ['RESEND_API_KEY'];
    const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);
    
    if (missingEnvVars.length > 0) {
        console.error('❌ Missing required environment variables:');
        missingEnvVars.forEach(envVar => {
            console.error(`   - ${envVar}`);
        });
        console.error('\nPlease create a .env file in the project root with the following:');
        console.error('RESEND_API_KEY=your_resend_api_key_here');
        process.exit(1);
    }

    // Validate Resend API key format
    if (!process.env.RESEND_API_KEY.startsWith('re_')) {
        console.error('❌ Invalid Resend API key format. It should start with "re_"');
        process.exit(1);
    }
};

// Initialize Express app
const app = express();

// Initialize Resend with error handling
let resend;
try {
    if (!process.env.RESEND_API_KEY) {
        console.error('❌ RESEND_API_KEY is missing in .env file');
        console.error('Please create a .env file with your Resend API key:');
        console.error('RESEND_API_KEY=your_resend_api_key_here');
        process.exit(1);
    }
    
    if (!process.env.RESEND_API_KEY.startsWith('re_')) {
        console.error('❌ Invalid Resend API key format');
        console.error('API key should start with "re_"');
        process.exit(1);
    }
    
    resend = new Resend(process.env.RESEND_API_KEY);
    console.log('✅ Resend API initialized successfully');
} catch (error) {
    console.error('❌ Failed to initialize Resend:', error.message);
    process.exit(1);
}

// Security Middleware
app.use(helmet()); // Set security HTTP headers
app.use(xss()); // Sanitize data
app.use(hpp()); // Prevent HTTP Parameter Pollution
app.use(mongoSanitize()); // Sanitize MongoDB queries

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later.'
});
app.use('/api/', limiter); // Apply rate limiting to API routes

// CORS configuration
app.use(cors({
    origin: '*', // Allow all origins during development
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Accept'],
    credentials: true
}));
app.use(express.json({ limit: '10kb' })); // Body limit is 10kb
app.use(express.urlencoded({ extended: true })); // Add this line to handle form data
app.use(express.static(path.join(__dirname), {
    maxAge: '1d',
    setHeaders: (res, path) => {
        if (path.endsWith('.html')) {
            res.setHeader('Cache-Control', 'no-cache');
        }
    }
}));

// Security headers middleware
app.use((req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
    next();
});

// Input validation middleware
const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
};

const validateInput = (req, res, next) => {
    const { name, email, message } = req.body;
    
    if (!name || !email || !message) {
        return res.status(400).json({
            success: false,
            error: 'All fields are required'
        });
    }

    if (name.length > 100 || message.length > 1000) {
        return res.status(400).json({
            success: false,
            error: 'Input length exceeds maximum allowed'
        });
    }

    if (!validateEmail(email)) {
        return res.status(400).json({
            success: false,
            error: 'Invalid email format'
        });
    }

    // Sanitize inputs
    req.body.name = name.trim().replace(/[<>]/g, '');
    req.body.message = message.trim().replace(/[<>]/g, '');
    req.body.email = email.trim().toLowerCase();

    next();
};

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ 
        status: 'ok', 
        message: 'Server is running',
        environment: process.env.NODE_ENV
    });
});

// Contact form endpoint
app.post('/api/contact', validateInput, async (req, res) => {
    console.log('\n🔍 ===== FORM SUBMISSION START =====');
    console.log('📥 Request received at:', new Date().toISOString());
    
    try {
        const { name, email, message } = req.body;
        
        // Validate input
        if (!name || !email || !message) {
            return res.status(400).json({
                success: false,
                error: 'All fields are required'
            });
        }

        console.log('📝 Form Data:');
        console.log('Name:', name);
        console.log('Email:', email);
        console.log('Message:', message);

        // Check if Resend is initialized
        if (!resend) {
            console.error('❌ Resend client not initialized');
            return res.status(500).json({
                success: false,
                error: 'Email service not configured properly. Please check server logs.'
            });
        }

        // Send email
        console.log('📤 Attempting to send email...');
        console.log('Using Resend API key:', process.env.RESEND_API_KEY ? 'Present' : 'Missing');
        
        const emailData = {
            from: 'webadi<fluffy-cactus-e100a9.netlify.app>', // Using Resend's test domain
            to: ['aditymishra6674@gmail.com'],
            subject: `New Contact Form Message from ${name}`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
                    <h2 style="color: #333; border-bottom: 2px solid #eee; padding-bottom: 10px;">New Contact Form Submission</h2>
                    <div style="margin: 20px 0;">
                        <p style="margin: 10px 0;"><strong style="color: #555;">Name:</strong> ${name}</p>
                        <p style="margin: 10px 0;"><strong style="color: #555;">Email:</strong> ${email}</p>
                    </div>
                    <div style="background: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
                        <h3 style="color: #444; margin-top: 0;">Message:</h3>
                        <p style="color: #666; line-height: 1.6;">${message}</p>
                    </div>
                </div>
            `,
            reply_to: email
        };

        console.log('📧 Sending email with data:', JSON.stringify(emailData, null, 2));

        const { data, error } = await resend.emails.send(emailData);

        if (error) {
            console.error('❌ Email error:', error);
            console.error('Error details:', JSON.stringify(error, null, 2));
            return res.status(500).json({
                success: false,
                error: `Failed to send email: ${error.message}`
            });
        }

        console.log('✅ Email sent successfully!');
        console.log('📨 Email response:', data);

        res.json({
            success: true,
            message: 'Message sent successfully! I will get back to you soon.'
        });

    } catch (error) {
        console.error('❌ Server error:', error);
        console.error('Error stack:', error.stack);
        res.status(500).json({
            success: false,
            error: `Internal server error: ${error.message}`
        });
    } finally {
        console.log('🔍 ===== FORM SUBMISSION END =====\n');
    }
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Server error:', err);
    
    // Don't expose error details in production
    const errorMessage = process.env.NODE_ENV === 'production' 
        ? 'Internal server error' 
        : err.message;
    
    res.status(500).json({ 
        success: false, 
        error: errorMessage 
    });
});

// Handle 404
app.use((req, res) => {
    res.status(404).json({
        success: false,
        error: 'Not found'
    });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`🔍 Health check: http://localhost:${PORT}/health`);
}); 