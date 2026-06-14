import { supabase } from './_lib/supabase.js';

export default async function handler(req, res) {

const { action } = req.query;

try {

```
// =====================
// GET USERS
// =====================

if (action === "get_users") {

  const { data, error } = await supabase
    .from("employees")
    .select("*")
    .order("employee_id");

  if (error) throw error;

  return res.status(200).json(data || []);
}

// =====================
// ADD USER
// =====================

if (action === "add_user") {

  const {
    employee_id,
    name,
    password,
    role
  } = req.body;

  if (
    !employee_id ||
    !name ||
    !password ||
    !role
  ) {
    return res.status(400).json({
      success: false,
      message: "Missing required fields"
    });
  }

  const { error } = await supabase
    .from("employees")
    .insert([
      {
        employee_id,
        name,
        password,
        role
      }
    ]);

  if (error) throw error;

  return res.status(200).json({
    success: true,
    message: "User added successfully"
  });
}

// =====================
// DELETE USER
// =====================

if (action === "delete_user") {

  const { employee_id } = req.body;

  const { error } = await supabase
    .from("employees")
    .delete()
    .eq("employee_id", employee_id);

  if (error) throw error;

  return res.status(200).json({
    success: true,
    message: "User deleted successfully"
  });
}

// =====================
// GET ADMINS
// =====================

if (action === "get_admins") {

  const { data, error } = await supabase
    .from("employees")
    .select("id, employee_id, name")
    .in("role", ["ADMIN", "SUPERADMIN"]);

  if (error) throw error;

  return res.status(200).json(data || []);
}

return res.status(400).json({
  success: false,
  message: "Invalid action"
});
```

} catch (err) {

```
console.error("users.js error:", err);

return res.status(500).json({
  success: false,
  message: err.message
});
```

}
}
