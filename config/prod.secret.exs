use Mix.Config

# In this file, we keep production configuration that
# you likely want to automate and keep it away from
# your version control system.
config :hackathon, Hackathon.Endpoint,
  secret_key_base: System.get_env("SECRET_KEY_BASE")

# Configure your database
config :hackathon, Hackathon.Repo,
  adapter: Ecto.Adapters.Mongo,
  url: System.get_env("DATABASE_URL"),
  pool_size: 20
