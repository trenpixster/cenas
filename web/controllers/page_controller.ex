defmodule Hackathon.PageController do
  use Hackathon.Web, :controller

  def index(conn, _params) do
    render conn, "index.html"
  end

  def start(conn, _params) do
    render conn, "start.html"
  end

  def snippet(conn, %{"nfa_id" => nfa_id}) do
    render conn, "snippet.js", nfa_id: nfa_id
  end
end
