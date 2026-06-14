import { supabase } from './_lib/supabase.js';

export default async function handler(req, res) {

try {

```
const { action, payload = {} } = req.body || {};

// ==========================
// ASSIGN ASSESSMENT
// ==========================

if (action === "assign") {

  const {
    employee_id,
    topic_id,
    duration,
    is_open = true
  } = payload;

  if (!employee_id || !topic_id) {
    return res.status(400).json({
      success: false,
      message: "employee_id and topic_id are required"
    });
  }

  const { error } = await supabase
    .from("assessments")
    .insert([
      {
        employee_id,
        topic_id,
        duration,
        is_open
      }
    ]);

  if (error) throw error;

  return res.status(200).json({
    success: true,
    message: "Assessment assigned successfully"
  });
}

// ==========================
// GET ASSIGNMENTS
// ==========================

if (action === "getAssignments") {

  const { data, error } = await supabase
    .from("assessments")
    .select("*")
    .order("id", { ascending: false });

  if (error) throw error;

  return res.status(200).json({
    success: true,
    data: data || []
  });
}

// ==========================
// TOGGLE OPEN/CLOSE
// ==========================

if (action === "toggle") {

  const {
    id,
    is_open
  } = payload;

  if (!id) {
    return res.status(400).json({
      success: false,
      message: "Assessment id required"
    });
  }

  const { error } = await supabase
    .from("assessments")
    .update({
      is_open
    })
    .eq("id", id);

  if (error) throw error;

  return res.status(200).json({
    success: true,
    message: "Assessment updated"
  });
}

return res.status(400).json({
  success: false,
  message: "Invalid action"
});
```

} catch (err) {

```
console.error("assessment.js error:", err);

return res.status(500).json({
  success: false,
  message: err.message
});
```

}
}
