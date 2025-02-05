export default {
  nav: {
    home: 'Home',
    products: 'Products',
    news: 'News',
    about: 'About Us',
    aiSupport: 'AI Support'
  },
  home: {
    hero: {
      title: 'Your Product Name',
      slogan: 'Your product slogan goes here',
      getStarted: 'Get Started'
    },
    about: {
      title: 'About Us',
      description:
        'Your company description goes here. This is a brief introduction about your organization and its mission.',
      productTitle: 'About Our Product',
      productSubtitle: 'Discover what makes us unique',
      learnMore: 'Learn More'
    },
    features: {
      title: 'Our Features',
      subtitle: 'What sets us apart from others',
      items: {
        fast: {
          title: 'Fast & Efficient',
          description:
            'Our solution provides lightning-fast performance and efficient resource utilization.'
        },
        secure: {
          title: 'Secure',
          description: 'Built with security in mind, protecting your data is our top priority.'
        },
        responsive: {
          title: 'Responsive',
          description: 'Works seamlessly across all devices and screen sizes.'
        }
      }
    },
    team: {
      title: 'Our Team',
      subtitle: 'Meet the people behind our success'
    }
  },
  news: {
    title: 'Latest News',
    subtitle: 'Stay updated with our latest stories',
    readMore: 'Read More',
    relatedArticles: 'Related Articles',
    loadMore: 'Load More',
    search: 'Search articles',
    categories: {
      all: 'All',
      product: 'Product',
      company: 'Company',
      technology: 'Technology'
    }
  },
  about: {
    title: 'About Us',
    subtitle: 'Pursuing Innovation and Excellence',
    company: {
      title: 'Company Profile',
      description:
        'We are a technology company dedicated to innovation and excellence. Since our establishment, we have always adhered to a customer-centric philosophy, providing the highest quality products and services. Our team consists of industry experts with rich experience and professional knowledge, committed to creating value for our customers.'
    },
    vision: {
      title: 'Our Vision',
      description:
        'To become a leading innovator in the industry, changing the world through technology and making a positive impact on human life.'
    },
    mission: {
      title: 'Our Mission',
      description:
        'To provide the best solutions for our customers through continuous innovation and quality service, creating sustainable business value.'
    },
    stats: {
      experience: 'Years of Experience',
      clients: 'Clients Served',
      projects: 'Successful Projects',
      awards: 'Awards Won'
    },
    team: {
      title: 'Core Team',
      description:
        'Our team consists of passionate professionals who have deep expertise and rich practical experience in their respective fields. We believe that only by building the best team can we provide the best solutions for our customers.'
    },
    contact: {
      title: 'Contact Us',
      formTitle: 'Leave us a Message',
      address: 'Address',
      phone: 'Phone',
      email: 'Email',
      form: {
        name: 'Name',
        email: 'Email',
        message: 'Message',
        send: 'Send Message',
        nameRequired: 'Name is required',
        nameLength: 'Name must be at least 2 characters',
        emailRequired: 'Email is required',
        emailValid: 'Please enter a valid email',
        messageRequired: 'Message is required',
        messageLength: 'Message must be at least 10 characters',
        success: 'Message sent successfully!',
        error: 'Failed to send message. Please try again later.'
      }
    },
    social: {
      title: 'Follow Us'
    }
  },
  footer: {
    aboutUs: 'About Us',
    quickLinks: 'Quick Links',
    contactUs: 'Contact Us',
    copyright: '© {year} Your Company Name. All rights reserved.'
  },
  common: {
    save: 'Save',
    close: 'Close'
  },
  auth: {
    login: 'Login',
    register: 'Register',
    profile: 'Profile',
    settings: 'Settings',
    logout: 'Logout',
    welcome: 'Welcome back, {name}',
    createAccount: 'Create Account',
    email: 'Email',
    password: 'Password',
    confirmPassword: 'Confirm Password',
    rememberMe: 'Remember Me',
    forgotPassword: 'Forgot Password?',
    noAccount: "Don't have an account?",
    haveAccount: 'Already have an account?',
    signIn: 'Sign In',
    signUp: 'Sign Up',
    passwordRequirements: 'Password must be at least 8 characters',
    passwordMatch: 'Passwords must match',
    username: 'Username',
    usernameRequired: 'Username is required',
    emailRequired: 'Email is required',
    passwordRequired: 'Password is required',
    invalidCredentials: 'Invalid email or password',
    accountCreated: 'Account created successfully!',
    logoutSuccess: 'You have been logged out successfully',
    emailInUse: 'This email is already in use',
    loginSuccess: 'Login successful!',
    registrationError: 'Registration failed, please try again later',
    profileCreationError: 'Failed to create user profile'
  },
  settings: {
    title: 'Settings',
    appearance: 'Appearance',
    darkMode: 'Dark Mode',
    followSystemTheme: 'Follow System Theme',
    primaryColor: 'Primary Color',
    secondaryColor: 'Secondary Color',
    accentColor: 'Accent Color',
    language: 'Language',
    selectLanguage: 'Select Language',
    saved: 'Settings saved successfully',
    error: 'Failed to save settings',
    updated: 'Settings Updated'
  },
  profile: {
    title: 'Profile',
    changeAvatar: 'Change Avatar',
    displayName: 'Display Name',
    displayNameRequired: 'Display name is required',
    phone: 'Phone Number',
    bio: 'Bio',
    avatarUpdated: 'Profile picture updated successfully',
    avatarError: 'Failed to update profile picture',
    displayNameUpdateWarning:
      'Profile saved successfully, but display name update requires re-login',
    saved: 'Profile saved successfully',
    saveFailed: 'Failed to save profile',
    phoneRequired: 'Phone number is required',
    phoneValid: 'Please enter a valid phone number',
    bioLength: 'Bio cannot exceed 500 characters'
  },
  aiSupport: {
    title: 'AI Support',
    placeholder: 'Please enter your question...',
    send: 'Send',
    thinking: 'Thinking',
    errorMessage: 'Sorry, an error occurred: ',
    welcomeMessage: 'Hello! I am an AI assistant. How can I help you?'
  }
}
