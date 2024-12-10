const todos = [];

const getTodos = async (request) => {
  return Response.json(todos);
};

const addTodo = async (request) => {
  let todo;
  try {
    todo = await request.json();
  } catch (e) {
    return new Response("Bad request", { status: 400 });
  }

  todos.push(todo);
  return new Response("OK", { status: 200 });
};

const urlMapping = [
  {
    method: "GET",
    pattern: new URLPattern({ pathname: "/todos" }),
    fn: getTodos,
  },
  {
    method: "POST",
    pattern: new URLPattern({ pathname: "/todos" }),
    fn: addTodo,
  },
];

const handleRequest = async (request) => {
  const mapping = urlMapping.find(
    (um) => um.method === request.method && um.pattern.test(request.url)
  );

  if (!mapping) {
    return new Response("Not found", { status: 404 });
  }

  const mappingResult = mapping.pattern.exec(request.url);
  return await mapping.fn(request, mappingResult);
};

Deno.serve({ port: 7777 }, handleRequest);