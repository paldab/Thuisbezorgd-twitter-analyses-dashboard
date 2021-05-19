import textwrap

def create_json(data, add_trimmed_text=False):
    json_data = []
    row_headers = [x for x in data[0].keys()]

    if add_trimmed_text is True:
        row_headers.append('trimmed_text')

    for row_values in data:

        if add_trimmed_text is True:
            trimmed_text = textwrap.shorten(row_values['text'], width=144, placeholder="...")
            row_values = (row_values['id'], row_values['text'], row_values['user_screenname'], row_values['created_at'], trimmed_text)


        json_data.append(dict(zip(row_headers, row_values)))

    return json_data