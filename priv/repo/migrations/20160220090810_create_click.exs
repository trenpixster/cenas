defmodule Hackathon.Repo.Migrations.CreateClick do
  use Ecto.Migration

  def change do
    create table(:click) do
      add :cid, :string
      add :nfa_id, :string
      add :payload, :map

      timestamps
    end

  end
end
