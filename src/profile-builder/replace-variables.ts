export type VariableOptions = {
  uuid: string;
  name: string;
  appID: string;
  payloadID: string;
  payloadUUID: string;
  organization: string;
  xmlConfig: string;
};

export default function replaceVariables(
  text: string,
  options: VariableOptions
) {
  let resultText = text;
  const variables = [
    ['__UUID__', options.uuid],
    ['__NAME__', options.name],
    ['__APP_IDENTIFIER__', options.appID],
    ['__PAYLOAD_IDENTIFIER__', options.payloadID],
    ['__PAYLOAD_UUID__', options.payloadUUID],
    ['__ORGANIZATION__', options.organization],
    ['__CONFIG__', options.xmlConfig]
  ];

  for (const [variable, value] of variables) {
    const regex = new RegExp(`{{${variable}}}`, 'g');
    resultText = resultText.replace(regex, value);
  }

  return resultText;
}
