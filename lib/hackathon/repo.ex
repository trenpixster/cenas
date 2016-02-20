defmodule Hackathon.Repo do
  use Ecto.Repo, otp_app: :hackathon, adapter: Mongo.Ecto
end
