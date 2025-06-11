# IP Subnet Calculator \& Practice Tool

### (based on [Professor Messer's Network+ Training Curse](https://www.youtube.com/watch?v=k7IOn3TiUc8&list=PLG49S3nxzAnl_tQe3kvnmeMid0mjF8Le8))

A comprehensive, interactive web application for calculating and practicing IP subnetting. This tool is designed for network students, professionals, and anyone looking to sharpen their networking skills. It features a calculator, a practice mode with scoring, and a detailed reference chart, all built with a clean, responsive interface that includes a dark mode.

**[Website](https://it-baer.github.io/subnet-calc-practice/)** 👈

## About The Project

This project was created to provide a simple tool for mastering IP subnetting. This one focuses on explaining the **"Magic Number" method**, providing step-by-step breakdowns for each calculation to help users understand the underlying process. It is built with vanilla HTML, CSS, and JavaScript, making it lightweight, fast, and easy to modify.

## Features

This application is divided into three main sections:

* **🧮 Calculator Mode**:
    * Calculates essential subnet information including Network ID, Broadcast Address, Usable Host Range, and Wildcard Mask.
    * Determines the "Magic Number" and identifies the "interesting octet" for the given IP and mask.
    * Provides a step-by-step guide explaining how the result was derived using the Magic Number method.
    * Displays binary representations for the IP address, subnet mask, and wildcard mask.
* **🎓 Practice Mode**:
    * Generates random subnetting problems to test your knowledge.
    * Adjustable difficulty levels: Class A, B, C, or a mix of all network types.
    * Enter your answers and receive immediate feedback on each field.
    * Keeps track of your score to monitor your progress.
* **📚 Reference Guide**:
    * A complete CIDR chart from /8 to /30, showing the corresponding subnet mask, wildcard, and number of usable hosts.
    * Filter the table to view masks by type (1-octet, 2-octet, or 3-octet) for focused study.
* **✨ Modern UI**:
    * Clean, intuitive, and fully responsive design that works on desktop and mobile devices.
    * Automatic light and dark mode based on your system preference.


## Built With

This project is built with fundamental web technologies and has no external dependencies.

* **HTML5**
* **CSS3** (utilizing CSS Variables for theming)
* **Vanilla JavaScript** (ES6 Classes)

[^2]: style.css

[^3]: app.js

