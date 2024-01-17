import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: 'Enter Key Here', dangerouslyAllowBrowser: true });

export const generateNotes = async (notes: string) => {

  try {

    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages:
        [{
          "role": "system",
          "content": "All responses must be structured and formatted in HTML tags.\
        Please assist me in organizing the following information into a structured format. \
        You must employ headers, sub-headers, bulleted lists, bolding, italicizing, and other relevant formatting methods to ensure clarity and ease of reference. Use these liberally. \
        Group related topics together and provide smooth transitions between different sections as necessary. \
        Be concise and speak plainly for easy reference later. Do your best to exclude redundant, or unecessary information. \
        This is a one-way interaction; no conversation is required, or allowed."},
        { "role": "user", "content": "A group of flamingos is called a flamboyance." },
        { "role": "assistant", "content": "<h1>Animal Groups</h1>\n<p>A group of <b>flamingos</b> is known as a <i>flamboyance</i>.</p>" },
        { "role": "user", "content": "The Eiffel Tower can be 15 cm taller during the summer." },
        { "role": "assistant", "content": "<h1>Interesting Information</h1>\n<p>The <b>Eiffel Tower</b> experiences a height incWrease of <i>15 cm</i> during the summer due to thermal expansion.</p>" },
        { "role": "user", "content": notes }],
      temperature: 0.9,
      stream: true,
    });

    return response;
  }

  catch(e){
    throw new Error(`Error submitting notes: ${e}`)
  }

}