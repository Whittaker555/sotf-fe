import { SecretsManagerClient, GetSecretValueCommand } from "@aws-sdk/client-secrets-manager";

// return type that contains the secret values
export type Secrets = {
  SPOTIFY_CLIENT_ID: string;
  SPOTIFY_CLIENT_SECRET: string;
  NEXTAUTH_SECRET: string;
};
// Function to retrieve secret value from AWS Secrets Manager
export async function getSecretValue(secretName: string): Promise<Secrets> {
  const client = new SecretsManagerClient({
    region: "eu-west-2", // Specify your AWS region
  });

  try {
    const command = new GetSecretValueCommand({ SecretId: secretName });
    const data = await client.send(command);

    if (data.SecretString) {
      return JSON.parse(data.SecretString);
    } else if (data.SecretBinary) {
      const buff = Buffer.from(data.SecretBinary as unknown as string, "base64");
      return JSON.parse(buff.toString("utf-8"));
    }

    throw new Error("Secret value is not a string or binary");
  } catch (err) {
    console.error(`Error retrieving secret ${secretName}:`, err);
    throw err;
  }
}
