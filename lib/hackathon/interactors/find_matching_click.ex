defmodule Hackathon.FindMatchingClick do
  alias Hackathon.Repo
  alias Hackathon.Click

  def call(url, target) do
    unicorn = Click.unicornify(url, target)
    format_response Repo.get_by(Click, unicorn: unicorn), unicorn
  end

  defp format_response(nil, unicorn) do
    {false, unicorn}
  end

  defp format_response(model, _) do
    {true, model}
  end
end