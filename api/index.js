import { supabase } from './_lib/supabase.js';

export default async function handler(req, res) {
  try {
    const action = req.query.action;

    // =========================
    // USERS
    // =========================

    if (action === "get_users") {
      const { data, error } = await supabase
        .from("employees")
        .select("*")
        .order("employee_id");

      if (error) throw error;

      return res.status(200).json(data || []);
    }

    if (action === "add_user") {
      const { employee_id, name, password, role } = req.body;

      if (!employee_id || !name || !password || !role) {
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

    // =========================
    // ADMINS
    // =========================

    if (action === "get_admins") {
      const { data, error } = await supabase
        .from("employees")
        .select("id,employee_id,name")
        .in("role", ["ADMIN", "SUPERADMIN"]);

      if (error) throw error;

      return res.status(200).json(data || []);
    }

    // =========================
    // TOPICS
    // =========================

    if (action === "topics") {
      const { data, error } = await supabase
        .from("topics")
        .select("*")
        .order("topic_name");

      if (error) throw error;

      return res.status(200).json(data || []);
    }

    if (action === "add_topic") {
      const { topic_name } = req.body;

      const { error } = await supabase
        .from("topics")
        .insert([{ topic_name }]);

      if (error) throw error;

      return res.status(200).json({
        success: true,
        message: "Topic added successfully"
      });
    }

    // =========================
    // ADMIN TOPIC PERMISSIONS
    // =========================

    if (action === "assign_topic") {
      const { admin_id, topic_id } = req.body;

      const { error } = await supabase
        .from("admin_topics")
        .insert([
          {
            admin_id,
            topic_id
          }
        ]);

      if (error) throw error;

      return res.status(200).json({
        success: true,
        message: "Permission assigned"
      });
    }

    // =========================
    // QUESTIONS
    // =========================

    if (action === "get_questions") {
      const { topic_id } = req.body;

      let query = supabase
        .from("questions")
        .select("*")
        .order("id");

      if (topic_id) {
        query = query.eq("topic_id", topic_id);
      }

      const { data, error } = await query;

      if (error) throw error;

      return res.status(200).json(data || []);
    }

    if (action === "add_question") {
      const {
        topic_id,
        question,
        option_a,
        option_b,
        option_c,
        option_d,
        correct_option
      } = req.body;

      const { error } = await supabase
        .from("questions")
        .insert([
          {
            topic_id,
            question,
            option_a,
            option_b,
            option_c,
            option_d,
            correct_option
          }
        ]);

      if (error) throw error;

      return res.status(200).json({
        success: true,
        message: "Question added"
      });
    }

    if (action === "update_question") {
      const {
        id,
        topic_id,
        question,
        option_a,
        option_b,
        option_c,
        option_d,
        correct_option
      } = req.body;

      const { error } = await supabase
        .from("questions")
        .update({
          topic_id,
          question,
          option_a,
          option_b,
          option_c,
          option_d,
          correct_option
        })
        .eq("id", id);

      if (error) throw error;

      return res.status(200).json({
        success: true,
        message: "Question updated"
      });
    }

    if (action === "delete_question") {
      const { id } = req.body;

      const { error } = await supabase
        .from("questions")
        .delete()
        .eq("id", id);

      if (error) throw error;

      return res.status(200).json({
        success: true,
        message: "Question deleted"
      });
    }

    // =========================
    // EMPLOYEES
    // =========================

    if (action === "get_employees") {
      const { data, error } = await supabase
        .from("employees")
        .select("employee_id,name")
        .eq("role", "EMPLOYEE")
        .order("employee_id");

      if (error) throw error;

      return res.status(200).json(data || []);
    }

    // =========================
    // ASSIGNMENTS
    // =========================

    if (action === "assign") {
      const {
        employee_id,
        topic_id,
        duration,
        is_open
      } = req.body;

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
        message: "Assessment assigned"
      });
    }

    if (action === "get_assignments") {
      const { data, error } = await supabase
        .from("assessments")
        .select(`
          id,
          employee_id,
          topic_id,
          duration,
          is_open
        `)
        .order("id", { ascending: false });

      if (error) throw error;

      return res.status(200).json(data || []);
    }

    // =========================
    // RESULTS
    // =========================

    if (action === "get_results") {
      const { data, error } = await supabase
        .from("attempts")
        .select("*")
        .order("attempt_date", { ascending: false });

      if (error) throw error;

      return res.status(200).json(data || []);
    }

    return res.status(404).json({
      success: false,
      message: "Invalid action"
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
}
