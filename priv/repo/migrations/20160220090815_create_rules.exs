defmodule Hackathon.Repo.Migrations.CreateRule do
  use Ecto.Migration

  def change do
    create table(:rule) do
      add :nfa_id, :string
      add :title, :string
      add :trigger, :map
      add :action, :map

      timestamps
    end

  end
end
