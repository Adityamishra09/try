# Modern Portfolio Website

A clean, modern, and responsive portfolio website built with HTML, CSS, and JavaScript. Features include smooth animations, contact form with EmailJS integration, and a beautiful UI design.

## Features

- 🎨 Modern and clean design
- 📱 Fully responsive layout
- 🎥 Animated hero section with video background
- ✨ Smooth scroll animations using GSAP
- 📧 Contact form with EmailJS integration
- 📄 Resume download functionality
- 🎯 Project showcase with beautiful cards
- 🌟 Interactive UI elements and hover effects
- 📱 Mobile-friendly navigation

## Setup Instructions

1. Clone this repository:
```bash
git clone <your-repo-url>
cd portfolio-website
```

2. Create an EmailJS account:
   - Go to [EmailJS](https://www.emailjs.com/) and create an account
   - Create an email service (Gmail, Outlook, etc.)
   - Create an email template
   - Get your Public Key, Service ID, and Template ID

3. Update the EmailJS configuration in `js/script.js`:
```javascript
emailjs.init("YOUR_PUBLIC_KEY");
// In the contact form handler:
await emailjs.send('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', formData);
```

4. Customize the content:
   - Update personal information in `index.html`
   - Add your projects in the `projects` array in `js/script.js`
   - Add your resume PDF to the `assets` folder
   - Add your background video to `assets/video/`
   - Add project images to `assets/images/`

5. Test locally:
   - Open `index.html` in your browser
   - Test all interactive features
   - Verify responsive design
   - Test contact form

## Customization

### Colors
Edit the CSS variables in `css/style.css`:
```css
:root {
    --primary-color: #2563eb;
    --secondary-color: #1e40af;
    --text-color: #1f2937;
    --light-text: #6b7280;
    --background: #ffffff;
    --section-bg: #f3f4f6;
}
```

### Projects
Add or modify projects in `js/script.js`:
```javascript
const projects = [
    {
        title: "Project Title",
        description: "Project description",
        image: "assets/images/project.jpg",
        technologies: ["Tech1", "Tech2"],
        github: "https://github.com/username/project",
        demo: "https://project-demo.com"
    }
];
```

### Animations
Modify GSAP animations in `js/script.js` to adjust timing and effects.

## File Structure

```
portfolio-website/
├── index.html
├── css/
│   └── style.css
├── js/
│   └── script.js
├── assets/
│   ├── images/
│   │   └── projects/
│   ├── video/
│   │   └── background.mp4
│   └── resume.pdf
└── README.md
```

## Dependencies

- [GSAP](https://greensock.com/gsap/) - For smooth animations
- [EmailJS](https://www.emailjs.com/) - For contact form functionality
- [Font Awesome](https://fontawesome.com/) - For icons
- [Google Fonts](https://fonts.google.com/) - For typography

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

Feel free to submit issues and enhancement requests!

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- GSAP for amazing animation capabilities
- EmailJS for easy email integration
- Font Awesome for beautiful icons
- Google Fonts for typography 