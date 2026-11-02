import { createClient } from 'next-sanity';

const client = createClient({
  projectId: 'o9db6b0a',
  dataset: 'production',
  apiVersion: '2024-08-30',
  useCdn: false,
  token: 'skNarasi77pxUewm96uLeNwHaSrmpkcOal68R7i1ukno1JJyh6Py67Aq2H6aUt7jTsYqir6BphcY9LfVGKTwOURXfQysyp7F2z8iH00GPSYJKIM7ZKZQ4tTyZj0Iq7AdNPGGYST7WF5lIVSDL5pwvHN9GCXBVW41gwB1YbbulmnwLsyzXy72'
});

async function main() {
  const banners = await client.fetch('*[_type == "banner"]');
  console.log('BANNERS:', JSON.stringify(banners, null, 2));
}

main().catch(console.error);
