export async function GET() {
  return Response.json({
    ok: true,
    message: "Funcionando"
  });
}

export async function POST() {
  return Response.json({
    ok: true
  });
}