# Next.js Weather Widget

The Next.js weather widget is a web application designed to provide users with up-to-date weather information for multiple locations. Built using Next.js, a popular React framework, this widget offers a responsive and interactive user experience.

## Features

### Main Components
- **Tabs for Weather Information:**
  - Switch between viewing weather information based on city names or geographical coordinates.
- **Location Input:**
  - Input the desired location in the corresponding input field and click the "Search" button to retrieve weather data.
  - If geolocation is available, the widget automatically fetches weather data based on the user's current coordinates.

### Weather Data Display
- **Visually Appealing Format:**
  - Weather information is displayed within a card-like container.
  - Each card features:
    - An icon representing the current weather condition.
    - Temperature in Celsius.
    - A brief description of the weather.
    - The location's name and the current date.
- **Additional Weather Details:**
  - Users can click on the "More" button to access additional weather details for the selected location.

### Drawer Component
- **Carousel for Multiple Locations:**
  - Users can open the drawer to reveal a carousel displaying weather information for multiple pre-defined locations simultaneously.
  - Each carousel item presents weather data in a similar format to the main widget, allowing users to quickly glance through the weather conditions of various cities without leaving the current page.

## Design and Functionality
With its intuitive design and comprehensive functionality, the Next.js weather widget provides users with a seamless way to stay informed about weather conditions worldwide.

## Packages Used
- **FontAwesome:**
  - For weather icons and other UI elements.
- **shadCN:**
  - For component styling and theming.
