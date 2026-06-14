import { supabase } from './_lib/supabase.js';

export default async function handler(req, res) {

const { action } = req.query;

try {

```
// ================= USERS =================

if (action === "get_users") {

  const { data, error } =
    await supabase
      .from("employees")
      .select("*")
      .order("employee_id");

  if (error) throw error;

  return res.status(200).json(data || []);
}

if (action === "add_user") {

  const {
    employee_id,
    name,
    password,
    role
  } = req.body;

  const { error } =
    await supabase
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
    message: "User added"
  });
}

if (action === "delete_user") {

  const { employee_id } =
    req.body;

  const { error } =
    await supabase
      .from("employees")
      .delete()
      .eq(
        "employee_id",
        employee_id
      );

  if (error) throw error;

  return res.status(200).json({
    success: true,
    message: "User deleted"
  });
}

// ================= ADMINS =================

if (action === "get_admins") {

  const { data, error } =
    await supabase
      .from("employees")
      .select(
        "id, employee_id, name"
      )
      .in(
        "role",
        ["ADMIN", "SUPERADMIN"]
      );

  if (error) throw error;

  return res.status(200).json(
    data || []
  );
}

// ================= TOPICS =================

if (action === "topics") {

  const { data, error } =
    await supabase
      .from("topics")
      .select("*")
      .order("id");

  if (error) throw error;

  return res.status(200).json(
    data || []
  );
}

if (action === "add_topic") {

  const { topic_name } =
    req.body;

  const { error } =
    await supabase
      .from("topics")
      .insert([
        {
          topic_name
        }
      ]);

  if (error) throw error;

  return res.status(200).json({
    success: true,
    message: "Topic added"
  });
}

// ================= ADMIN TOPICS =================

if (action === "assign_topic") {

  const {
    admin_id,
    topic_id
  } = req.body;

  const { error } =
    await supabase
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
    message: "Assigned"
  });
}

// ================= QUESTIONS =================

if (action === "get_questions") {

  const { topic_id } =
    req.body;

  const { data, error } =
    await supabase
      .from("questions")
      .select("*")
      .eq(
        "topic_id",
        topic_id
      )
      .order("id");

  if (error) throw error;

  return res.status(200).json(
    data || []
  );
}

if (action === "add_question") {

  const { error } =
    await supabase
      .from("questions")
      .insert([
        req.body
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
    ...rest
  } = req.body;

  const { error } =
    await supabase
      .from("questions")
      .update(rest)
      .eq("id", id);

  if (error) throw error;

  return res.status(200).json({
    success: true,
    message: "Updated"
  });
}

if (action === "delete_question") {

  const { id } =
    req.body;

  const { error } =
    await supabase
      .from("questions")
      .delete()
      .eq("id", id);

  if (error) throw error;

  return res.status(200).json({
    success: true,
    message: "Deleted"
  });
}

if (action === "upload_questions") {

  const {
    topic_id,
    questions
  } = req.body;

  const rows =
    questions.map(q => ({
      topic_id,
      question:
        q.question,
      option_a:
        q.option_a,
      option_b:
        q.option_b,
      option_c:
        q.option_c,
      option_d:
        q.option_d,
      correct_option:
        q.correct_option
    }));

  const { error } =
    await supabase
      .from("questions")
      .insert(rows);

  if (error) throw error;

  return res.status(200).json({
    success: true,
    inserted: rows.length
  });
}

// ================= EMPLOYEES =================

if (action === "get_employees") {

  const { data, error } =
    await supabase
      .from("employees")
      .select(
        "employee_id,name"
      )
      .eq(
        "role",
        "EMPLOYEE"
      );

  if (error) throw error;

  return res.status(200).json(
    data || []
  );
}

// ================= ASSIGNMENTS =================

if (action === "assign") {

  const {
    employee_id,
    topic_id,
    duration,
    is_open
  } = req.body;

  const { error } =
    await supabase
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
    message: "Assigned"
  });
}

if (action === "get_assignments") {

  const { data, error } =
    await supabase
      .from("assessments")
      .select("*")
      .order(
        "id",
        {
          ascending: false
        }
      );

  if (error) throw error;

  return res.status(200).json(
    data || []
  );
}

// ================= EMPLOYEE ASSESSMENT =================

if (action === "get_assessment") {

  const employee_id =
    req.query.employee_id;

  const {
    data: assessments
  } =
  await supabase
    .from("assessments")
    .select("*")
    .eq(
      "employee_id",
      employee_id
    )
    .eq(
      "is_open",
      true
    )
    .limit(1);

  if (
    !assessments ||
    assessments.length === 0
  ) {
    return res.status(404).json({
      success: false,
      message:
        "No assessment found"
    });
  }

  const assessment =
    assessments[0];

  const {
    data: topics
  } =
  await supabase
    .from("topics")
    .select("*")
    .eq(
      "id",
      assessment.topic_id
    );

  const {
    data: questions
  } =
  await supabase
    .from("questions")
    .select("*")
    .eq(
      "topic_id",
      assessment.topic_id
    );

  return res.status(200).json({

    success: true,

    topic:
      topics?.[0]
        ?.topic_name || "",

    duration:
      assessment.duration,

    questions:
      questions || []

  });
}

if (action === "submit") {

  const {
    employee_id,
    answers,
    questions,
    time_taken
  } = req.body;

  let correct = 0;

  questions.forEach(
    (q, index) => {

      if (
        answers[index] &&
        answers[index] ===
        q.correct_option
      ) {
        correct++;
      }

    }
  );

  const score =
    Math.round(
      (
        correct /
        questions.length
      ) * 100
    );

  const topic_id =
    questions[0]
      ?.topic_id;

  const { error } =
    await supabase
      .from("attempts")
      .insert([
        {
          employee_id,
          topic_id,
          score,
          time_taken,
          attempt_date:
            new Date()
              .toISOString()
        }
      ]);

  if (error) throw error;

  return res.status(200).json({
    success: true,
    score
  });
}

// ================= RESULTS =================

if (action === "get_results") {

  const { data, error } =
    await supabase
      .from("attempts")
      .select("*")
      .order(
        "attempt_date",
        {
          ascending: false
        }
      );

  if (error) throw error;

  return res.status(200).json(
    data || []
  );
}

return res.status(400).json({
  success: false,
  error: "Invalid action"
});
```

} catch (err) {

```
console.error(
  "API ERROR:",
  err
);

return res.status(500).json({
  success: false,
  error: err.message
});
```

}
}
