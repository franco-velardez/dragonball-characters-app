// populate-db.js
import { createClient } from '@supabase/supabase-js';
import axios from 'axios';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

// Configuration
const DRAGONBALL_API = 'https://dragonball-api.com/api';
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_KEY;
const BATCH_SIZE = 10; // Number of characters to process at a time

if (!SUPABASE_URL || !SUPABASE_KEY) {
  throw new Error('Supabase URL and Key must be provided in environment variables');
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function fetchAllCharacters() {
  try {
    console.log('Fetching character list...');
    const response = await axios.get(`${DRAGONBALL_API}/characters?limit=1000`);
    return response.data.items || [];
  } catch (error) {
    console.error('Error fetching character list:', error);
    return [];
  }
}

async function fetchCharacterDetails(characterId) {
  try {
    const response = await axios.get(`${DRAGONBALL_API}/characters/${characterId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching details for character ${characterId}:`, error);
    return null;
  }
}

async function insertCharacter(character) {
  const { data, error } = await supabase
    .from('characters')
    .insert({
      name: character.name,
      description: character.description || `${character.name} from Dragon Ball`,
      image: character.image || `${character.name.toLowerCase().replace(/\s+/g, '-')}.jpg`
    })
    .select()
    .single();

  if (error) {
    console.error(`Error inserting character ${character.name}:`, error);
    return null;
  }

  return data;
}

async function insertTransformations(characterId, transformations) {
  if (!transformations || transformations.length === 0) return;

  const formattedTransformations = transformations.map(t => ({
    character_id: characterId,
    name: t.name || 'Unknown Transformation',
    description: t.description || '',
    ki: t.ki || 'Unknown',
    image: t.image || ''
  }));

  const { error } = await supabase
    .from('character_transformations')
    .insert(formattedTransformations);

  if (error) {
    console.error(`Error inserting transformations for character ${characterId}:`, error);
  }
}

async function processCharacter(character) {
  console.log(`Processing ${character.name}...`);

  // Get full character details
  const details = await fetchCharacterDetails(character.id);
  if (!details) return;

  // Insert base character
  const insertedChar = await insertCharacter(details);
  if (!insertedChar) return;

  // Insert transformations if they exist
  if (details.transformations && details.transformations.length > 0) {
    await insertTransformations(insertedChar.id, details.transformations);
  }
}

async function processInBatches(characters) {
  for (let i = 0; i < characters.length; i += BATCH_SIZE) {
    const batch = characters.slice(i, i + BATCH_SIZE);
    await Promise.all(batch.map(processCharacter));
    console.log(`Processed batch ${i / BATCH_SIZE + 1}`);
    // Add delay to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
}

async function main() {
  try {
    // Fetch all characters
    const characters = await fetchAllCharacters();
    if (characters.length === 0) {
      console.log('No characters found');
      return;
    }

    console.log(`Found ${characters.length} characters to process`);

    // Process in batches
    await processInBatches(characters);

    console.log('Database population complete!');
  } catch (error) {
    console.error('Script failed:', error);
  }
}

main();