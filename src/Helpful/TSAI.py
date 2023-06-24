import openai

# Set up your OpenAI API key
openai.api_key = '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'

def generate_recipe_instructions(recipe_name):
    prompt = f'You are writing a recipe for {recipe_name}. The recipe should include the following steps:'

    # Generate instructions using OpenAI GPT-3.5
    response = openai.Completion.create(
        engine='text-davinci-003',
        prompt=prompt,
        max_tokens=100,
        temperature=0.7,
        n=1,
        stop=None,
        timeout=10
    )

    # Extract the generated instructions from the response
    instructions = response.choices[0].text.strip()

    return instructions

# Generate recipe instructions for a specific recipe
recipe_name = "Chocolate Chip Cookies"
instructions = generate_recipe_instructions(recipe_name)
print(f"Recipe Instructions for {recipe_name}:")
print(instructions)
