defmodule Hackathon.Repo.Migrations.CreateUser do
  use Ecto.Migration

  def change do
    create table(:user) do
      add :username, :string
      add :email, :string
      add :hash, :string

      timestamps
    end

  end
end
