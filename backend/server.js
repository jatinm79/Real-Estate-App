const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://127.0.0.1:3000',
    process.env.FRONTEND_URL
  ].filter(Boolean),
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept']
}));

app.options('*', cors());

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use(helmet());
app.use(morgan('dev'));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Backend server is running!',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

app.post('/api/properties/test', (req, res) => {
  console.log('🧪 Test property creation received:', req.body);
  
  const { project_name, builder_name, location, price } = req.body;
  
  if (!project_name || !builder_name || !location || !price) {
    return res.status(400).json({
      status: 'error',
      message: 'Missing required fields: project_name, builder_name, location, price'
    });
  }

  setTimeout(() => {
    res.status(201).json({
      status: 'success',
      message: 'Test property created successfully!',
      data: {
        property: {
          id: Math.floor(Math.random() * 1000),
          project_name,
          builder_name,
          location,
          price: parseFloat(price),
          description: req.body.description || 'Test property description',
          main_image: 'https://via.placeholder.com/600x400/3B82F6/FFFFFF?text=Property+Image',
          gallery_images: [],
          bedrooms: req.body.bedrooms || 3,
          bathrooms: req.body.bathrooms || 2,
          area: req.body.area || 2000,
          property_type: req.body.property_type || 'House',
          year_built: req.body.year_built || 2020,
          parking: req.body.parking || 2,
          floors: req.body.floors || 2,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      }
    });
  }, 1000);
});

app.get('/api/properties', (req, res) => {
  console.log('📦 Fetching properties');
  res.status(200).json({
    status: 'success',
    data: {
      properties: [
        {
          id: 1,
          project_name: "Sample Luxury Villa",
          builder_name: "Elite Builders",
          location: "Mumbai",
          price: 25000000,
          description: "Beautiful luxury villa with modern amenities",
          main_image: "https://via.placeholder.com/600x400/3B82F6/FFFFFF?text=Luxury+Villa",
          property_type: "Villa",
          bedrooms: 4,
          bathrooms: 3,
          area: 3200,
          created_at: new Date().toISOString()
        }
      ]
    }
  });
});

app.post('/api/properties', (req, res) => {
  console.log('🏠 Property creation request received:', req.body);
  
  const { project_name, builder_name, location, price } = req.body;
  
  if (!project_name || !builder_name || !location || !price) {
    return res.status(400).json({
      status: 'error',
      message: 'Missing required fields: project_name, builder_name, location, price'
    });
  }

  const property = {
    id: Date.now(),
    project_name,
    builder_name,
    location,
    price: parseFloat(price),
    description: req.body.description || '',
    main_image: 'https://via.placeholder.com/600x400/10B981/FFFFFF?text=' + encodeURIComponent(project_name),
    gallery_images: [],
    bedrooms: req.body.bedrooms ? parseInt(req.body.bedrooms) : null,
    bathrooms: req.body.bathrooms ? parseInt(req.body.bathrooms) : null,
    area: req.body.area ? parseInt(req.body.area) : null,
    property_type: req.body.property_type || null,
    year_built: req.body.year_built ? parseInt(req.body.year_built) : null,
    parking: req.body.parking ? parseInt(req.body.parking) : null,
    floors: req.body.floors ? parseInt(req.body.floors) : null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };

  console.log('✅ Property created successfully:', property);

  res.status(201).json({
    status: 'success',
    message: 'Property created successfully!',
    data: {
      property
    }
  });
});

app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({
    status: 'error',
    message: 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { error: err.message })
  });
});

app.use('*', (req, res) => {
  res.status(404).json({
    status: 'error',
    message: `Route ${req.originalUrl} not found`
  });
});

app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/api/health`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`Static files: http://localhost:${PORT}/uploads/`);
  console.log('Ready for property creation!');
});