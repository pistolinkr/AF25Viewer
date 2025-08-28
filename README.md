# AF Viewer (AlphaFold Protein Structure Viewer)

A modern, interactive web-based viewer for exploring AlphaFold protein structure predictions with advanced visualization capabilities.

## 🌟 Features

- **3D Protein Visualization**: Interactive 3D rendering of protein structures using Three.js
- **AlphaFold Integration**: Direct access to AlphaFold DB structures via UniProt IDs
- **Multiple Representation Styles**: Cartoon, ribbon, surface, and atom representations
- **Advanced Color Schemes**: Customizable coloring by secondary structure, chain, or residue properties
- **Interactive Controls**: Mouse and touch-based camera controls for structure exploration
- **Measurement Tools**: Distance and angle measurements between atoms
- **Cross-Platform**: Responsive design supporting desktop, tablet, and mobile devices
- **Bilingual Interface**: Korean and English language support

## 🚀 Quick Start

1. **Clone the repository**:
   ```bash
   git clone https://github.com/pistolinkr/Protein2025Bartender.git
   cd Protein2025Bartender
   ```

2. **Open in browser**:
   - Simply open `protein-viewer.html` in any modern web browser
   - No server setup required - runs entirely client-side

3. **View a protein**:
   - Enter a UniProt ID (e.g., `P53_HUMAN`, `P12345`)
   - Click "Search" to load and visualize the protein structure
   - Use mouse/touch to rotate, zoom, and explore the 3D structure

## 🎯 Usage

### Basic Navigation
- **Rotate**: Click and drag to rotate the protein
- **Zoom**: Scroll wheel or pinch gestures
- **Pan**: Right-click and drag or two-finger drag

### Structure Representation
- **Cartoon**: Ribbon-like representation showing secondary structure
- **Surface**: Molecular surface with transparency options
- **Atoms**: Individual atom representation
- **Ribbon**: Classic ribbon representation

### Color Options
- **Secondary Structure**: Color by alpha helices, beta sheets, loops
- **Chain**: Different colors for each protein chain
- **Residue**: Color by amino acid properties
- **Custom**: User-defined color schemes

### Advanced Features
- **Measurement Tools**: Measure distances and angles between atoms
- **View Presets**: Predefined camera positions for common viewing angles
- **Export Options**: Save images or structural data
- **Performance Settings**: Adjust rendering quality for optimal performance

## 🛠️ Technical Details

- **Frontend**: Pure HTML5, CSS3, and JavaScript (ES6+)
- **3D Graphics**: Three.js for WebGL-based rendering
- **Data Sources**: AlphaFold DB API for protein structures
- **File Formats**: Support for PDB and mmCIF formats
- **Responsive Design**: Mobile-first approach with touch support

## 📱 Browser Compatibility

- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+
- Mobile browsers with WebGL support

## 🔧 Customization

The viewer is highly customizable through CSS variables and JavaScript configuration:

```css
:root {
  --primary-color: #007bff;
  --secondary-color: #6c757d;
  --background-color: #ffffff;
  --text-color: #212529;
}
```

## 📚 API Reference

### Core Functions
- `loadProtein(uniprotId)`: Load protein structure from AlphaFold DB
- `setRepresentation(type)`: Change structure representation
- `setColorScheme(scheme)`: Apply color scheme
- `resetCamera()`: Reset camera to default position

### Event Handlers
- `onStructureLoaded`: Fired when protein structure is loaded
- `onCameraChanged`: Fired when camera position changes
- `onSelectionChanged`: Fired when atoms are selected

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](https://github.com/pistolinkr/Protein2025Bartender/blob/main/CONTRIBUTING.md) for details.

### Development Setup
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](https://github.com/pistolinkr/Protein2025Bartender/blob/main/LICENSE) file for details.

## 🙏 Acknowledgments

- **AlphaFold Team**: For providing the protein structure predictions
- **Three.js Community**: For the excellent 3D graphics library
- **UniProt Consortium**: For protein sequence and annotation data
- **Open Source Community**: For various supporting libraries and tools

## 📞 Support

- **Issues**: Report bugs and request features on [GitHub Issues](https://github.com/pistolinkr/Protein2025Bartender/issues)
- **Discussions**: Join community discussions on [GitHub Discussions](https://github.com/pistolinkr/Protein2025Bartender/discussions)
- **Repository**: Visit our [GitHub Repository](https://github.com/pistolinkr/Protein2025Bartender)

## 🔮 Roadmap

- [ ] Support for multiple protein structures simultaneously
- [ ] Advanced analysis tools (RMSD, structure comparison)
- [ ] Integration with other protein databases
- [ ] VR/AR support for immersive viewing
- [ ] Batch processing capabilities
- [ ] Plugin system for custom visualizations

---

**Made with ❤️ for the structural biology community**

---

**Repository**: [https://github.com/pistolinkr/Protein2025Bartender](https://github.com/pistolinkr/Protein2025Bartender)
**Owner**: Pistol™ Gongsaeng™
