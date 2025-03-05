export default async function handler(req, res) {
    if (req.method === 'POST') {
      const { fullname, email, password } = req.body;
      // Process the data (e.g., save to a database)
      res.status(200).json({ status: 'success', message: 'Signup successful!' });
    } else {
      res.status(405).json({ status: 'error', message: 'Method not allowed' });
    }
  }