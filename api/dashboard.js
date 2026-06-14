import { supabase } from './_lib/supabase.js';

export default async function handler(req, res) {

try {

```
const [
  usersResult,
  topicsResult,
  questionsResult,
  attemptsResult,
  assessmentsResult
] = await Promise.all([

  supabase
    .from('employees')
    .select('*', { count: 'exact', head: true }),

  supabase
    .from('topics')
    .select('*', { count: 'exact', head: true }),

  supabase
    .from('questions')
    .select('*', { count: 'exact', head: true }),

  supabase
    .from('attempts')
    .select('*', { count: 'exact', head: true }),

  supabase
    .from('assessments')
    .select('*', { count: 'exact', head: true })

]);

return res.status(200).json({

  success: true,

  users: usersResult.count || 0,

  topics: topicsResult.count || 0,

  questions: questionsResult.count || 0,

  attempts: attemptsResult.count || 0,

  assessments: assessmentsResult.count || 0

});
```

} catch (err) {

```
console.error("dashboard.js error:", err);

return res.status(500).json({
  success: false,
  message: err.message
});
```

}
}
