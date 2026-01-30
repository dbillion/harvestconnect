export async function graphqlRequest<T>(query: string, variables: Record<string, any> = {}): Promise<T> {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/graphql/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query,
      variables,
    }),
  });

  const { data, errors } = await response.json();

  if (errors) {
    throw new Error(errors[0].message);
  }

  return data;
}
