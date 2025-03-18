// RegisterStyles.js

import { StyleSheet } from 'react-native';

// Define color constants for consistency
const COLORS = {
  primary: '#FFFFFF',        // White
  secondary: '#000000',      // Black
  accent: '#8B4513',         // SaddleBrown
  error: '#FF6347',          // Tomato for errors
  border: '#CCCCCC',         // Light gray for borders
  background: '#F5F5F5',     // Light gray background
  text: '#333333',           // Darker text for better readability
  buttonText: '#FFFFFF',     // White text for buttons
  placeholder: '#999999',    // Gray for placeholders
};

const styles = StyleSheet.create({
  // Container Styles
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    padding: 20,
  },
  // Card Styles
  card: {
    backgroundColor: COLORS.primary,
    padding: 40,
    borderRadius: 15,
    width: '100%',
    maxWidth: 400,
    shadowColor: COLORS.secondary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5, // For Android shadow
  },
  // Title Styles
  title: {
    fontSize: 28,
    color: COLORS.text,
    marginBottom: 20,
    textAlign: 'center',
    fontWeight: 'bold',
    fontFamily: 'Roboto-Bold', // Ensure custom font is loaded
  },
  // Input Container Styles
  inputContainer: {
    position: 'relative',
    marginBottom: 15,
  },
  // Icon Styles inside Inputs
  iconContainer: {
    position: 'absolute',
    top: 15,
    left: 15,
    zIndex: 1,
  },
  // Input Styles
  input: {
    width: '100%',
    padding: 15,
    paddingLeft: 45, // Space for the icon
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    fontSize: 16,
    color: COLORS.text,
    backgroundColor: COLORS.background,
  },
  // Button Styles
  button: {
    backgroundColor: COLORS.secondary,
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
    shadowColor: COLORS.secondary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3, // For Android shadow
  },
  // Disabled Button Styles
  buttonDisabled: {
    backgroundColor: '#A9A9A9', // DarkGray when disabled
  },
  // Button Text Styles
  buttonText: {
    color: COLORS.buttonText,
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'Roboto-Bold', // Ensure custom font is loaded
  },
  // Error Message Styles
  errorMessage: {
    color: COLORS.error,
    fontSize: 14,
    marginTop: 5,
    textAlign: 'center',
    fontFamily: 'Roboto-Regular', // Ensure custom font is loaded
  },
  // Register Link Container Styles
  registerLinkContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  // Register Link Text Styles
  registerLink: {
    color: COLORS.accent,
    fontSize: 16,
    textDecorationLine: 'underline',
    fontFamily: 'Roboto-Regular', // Ensure custom font is loaded
  },
  // Optional: Forgot Password Styles
  forgotPasswordContainer: {
    alignItems: 'center',
    marginTop: 10,
  },
  forgotPasswordText: {
    color: COLORS.accent,
    fontSize: 16,
    textDecorationLine: 'underline',
    fontFamily: 'Roboto-Regular', // Ensure custom font is loaded
  },
});

export default styles;
