import { getTask } from '@/app/api/data/task';

// export async function GET(
//     request: Request,
//     { params }: { params: { taskId: string } }
// ) {
//     const task = await getTask(params.taskId)
//     if (!task) {
//         return Response.json({ error: "Task not found" }, { status: 404 })
//     }
//     return Response.json(task)
// }

export async function GET(request: Request, { params }: { params: { taskId: string } }) {
  console.log('API tasks GET taskId: ', params.taskId);

  if (params.taskId === undefined) {
    return Response.json({ status: 'error', message: 'taskId not defined' });
  }

  const task = await getTask(params.taskId);
  if (!task) {
    return Response.json({ status: 'error', message: 'Task not found' });
  }
  return Response.json({ status: 'success', data: task });
}
