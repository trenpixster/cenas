defmodule Hackathon.User do
  use Hackathon.Web, :model

  @primary_key {:id, :binary_id, autogenerate: true}
  schema "user" do
    field :username, :string
    field :email, :string
    field :hash, :string
    field :tid, :string

    timestamps
  end

  @required_fields ~w(username email hash tid)
  @optional_fields ~w()

  @doc """
  Creates a changeset based on the `model` and `params`.

  If no params are provided, an invalid changeset is returned
  with no validation performed.
  """
  def changeset(model, params \\ :empty) do
    model
    |> cast(params, @required_fields, @optional_fields)
  end
end
