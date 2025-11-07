// TAGether - Share self-made exam for classmates
// CopyRight (c) 2020-2024 watasuke
//
// Email  : <watasuke102@gmail.com>
// Twitter: @Watasuke102
// This software is released under the MIT or MIT SUSHI-WARE License.

type Field = {
  name: string;
  value: string;
};

export async function webhook(url: string, title: string, field: Field[]): Promise<Response> {
  if (url === '') {
    return Promise.resolve(new Response());
  }
  return fetch(url, {
    method: 'POST',
    body: JSON.stringify({
      avatar_url: 'https://data.watasuke.net/icon.png',
      embeds: [{type: 'rich', title: title, color: 0x7b6fc0, fields: field}],
    }),
    headers: {'Content-Type': 'application/json'},
  });
}
