import { supabase } from './_lib/supabase.js';

export default async function handler(req, res) {
  try {

    if (req.method !== 'POST') {
      return res.status(405).json({
        success: false,
        error: 'Method not allowed'
      });
    }

    const {
      employee_id,
      password
    } = req.body || {};

    if (!employee_id || !password) {
      return res.json({
        success: false,
        error: 'Missing credentials'
      });
    }

    const { data, error } = await supabase
      .from('employees')
      .select('*')
      .eq(
        'employee_id',
        employee_id.toString().trim()
      );

    if (error) {
      throw error;
    }

    if (!data || data.length === 0) {
      return res.json({
        success: false,
        error: 'User not found'
      });
    }

    const user = data[0];

    if (user.password !== password) {
      return res.json({
        success: false,
        error: 'Wrong password'
      });
    }

    return res.json({
      success: true,
      employee_id: user.employee_id,
      name: user.name,
      role: user.role
    });

  } catch (err) {

    console.error(err);

    return res.status(500).json({
      success: false,
      error: 'Server error'
    });

  }
}
