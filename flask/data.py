import twint

c = twint.Config()

c.Search = '#thuisbezorgd'
c.Since = '2020-12-31'
c.Lang = 'nl'
c.Output = 'tweets.csv'
c.Pandas = True

twint.run.Search(c)

tweets_df = twint.storage.panda.Tweets_df
