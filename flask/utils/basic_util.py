import textwrap

def create_json(data, add_trimmed_text=False):
    json_data = []
    row_headers = [x for x in data[0].keys()]

    if add_trimmed_text is True:
        row_headers.append('trimmed_text')

    for row_values in data:

        if add_trimmed_text is True:
            trimmed_text = textwrap.shorten(tweet['text'], width=144, placeholder="...")
            tweet = (tweet['id'], tweet['text'], tweet['user_screenname'], tweet['created_at'], trimmed_text)


        json_data.append(dict(zip(row_headers, row_values)))

    return json_data