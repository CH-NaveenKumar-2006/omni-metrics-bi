const jwt = require('jsonwebtoken');

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required' });
    }

    if (password !== 'admin123' && password !== 'password') {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const payload = {
      id: 'a11a22b3-44c5-66d7-88e9-001122334455',
      email,
      role: 'admin',
      orgId: 'b47a9821-39d2-43cf-8302-3f112e4b0001'
    };

    const secret = process.env.JWT_SECRET || 'dev_secret_key_123';
    const token = jwt.sign(payload, secret, { expiresIn: '12h' });

    res.json({
      success: true,
      token,
      user: {
        id: payload.id,
        email: payload.email,
        role: payload.role
      }
    });
  } catch (err) {
    next(err);
  }
};

exports.getDemoToken = async (req, res, next) => {
  try {
    const payload = {
      id: 'demo-analyst-001',
      email: 'analyst@acme.io',
      role: 'analyst',
      orgId: 'b47a9821-39d2-43cf-8302-3f112e4b0001'
    };
    const secret = process.env.JWT_SECRET || 'dev_secret_key_123';
    const token = jwt.sign(payload, secret, { expiresIn: '24h' });
    res.json({ success: true, token, user: payload });
  } catch (err) {
    next(err);
  }
};
