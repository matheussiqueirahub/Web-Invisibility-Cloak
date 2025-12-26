Web Invisibility Cloak

Author: Matheus Siqueira

Description
This application implements a real-time "invisibility cloak" effect directly in the web browser. Using computer vision techniques and pixel manipulation, it detects a specific color range (Hue, Saturation, Value) in the video feed and replaces those pixels with a previously captured background image.

The project demonstrates high-performance image processing in JavaScript/TypeScript using HTML5 Canvas, without requiring external video processing libraries or backend servers for the video loop.

Features
- Real-time Background Subtraction: Captures a static reference frame to use as the background.
- Adjustable Color Detection: Users can select any target color to mask out.
- Fine-Tuning Controls: Precision sliders for Hue, Saturation, and Brightness thresholds to handle various lighting conditions.
- Intelligent Scene Analysis: Integrated AI assistant to analyze the scene and explain the underlying computer vision concepts.

Installation and Usage

1. Clone the repository or download the source code.
2. Install dependencies:
   npm install

3. Run the development server:
   npm start

4. Open your browser to the local server address (usually http://localhost:3000).

Usage Instructions
1. Allow camera permissions when prompted.
2. Ensure the camera is stable and pointing at the scene.
3. Step out of the frame so the camera sees only the background.
4. Click "Capture Background".
5. Step back into the frame holding an object of the target color (default is Red).
6. Use the Control Panel to adjust the color and sensitivity if the masking is not perfect.

Technical Stack
- React
- TypeScript
- HTML5 Canvas API
- Tailwind CSS
- Artificial Intelligence SDK (for scene analysis)
