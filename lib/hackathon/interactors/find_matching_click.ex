defmodule Hackathon.FindMatchingClick do
  alias Hackathon.Repo
  alias Hackathon.Click

  def call(url, target) do
    unicorn = Click.unicornify(url, target)
    IO.puts "unicorn: #{unicorn}"
    format_response(Repo.get_by(Click, unicorn: unicorn), unicorn)
  end

  defp format_response(response, unicorn) do
    case response do
        nil -> {false, unicorn}
        model -> {true, model}
    end
  end

end
