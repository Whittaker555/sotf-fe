import { SecretsManagerClient, GetSecretValueCommand } from "@aws-sdk/client-secrets-manager";

// Function to retrieve secret value from AWS Secrets Manager
export async function getSecretValue(secretName: string): Promise<string> {
  const client = new SecretsManagerClient({
    region: "eu-west-2", // Specify your AWS region
  });

  try {
    const command = new GetSecretValueCommand({ SecretId: secretName });
    const data = await client.send(command);

    if (data.SecretString) {
      return data.SecretString;
    } else if (data.SecretBinary) {
      const buff = Buffer.from(data.SecretBinary as unknown as string, "base64");
      return buff.toString("ascii");
    }

    return "";
  } catch (err) {
    console.error(`Error retrieving secret ${secretName}:`, err);
    throw err;
  }
}
