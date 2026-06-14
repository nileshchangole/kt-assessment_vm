import { supabase } from './_lib/supabase.js';

export default async function handler(req, res) {

  try {

    const { data, error } =
      await supabase
        .from('topics')
        .select('*');

    if (error) {
      return res.status(500).json({
        success: false,
        error
      });
    }

    return res.status(200).json({
      success: true,
      data
    });

  } catch (err) {

    return res.status(500).json({
      success: false,
      message: err.message,
      stack: err.stack
    });

  }

}
