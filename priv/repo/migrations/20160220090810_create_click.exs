defmodule Hackathon.Repo.Migrations.CreateClick do
  use Ecto.Migration

  def change do
    create table(:click) do
      add :unicorn, :string
      add :url, :string
      add :cid, :string
      add :events, {:array, :map}
      add :nfa_id, :string
      add :ignored, :boolean
      add :payload, :map

      timestamps
    end

  end
end
