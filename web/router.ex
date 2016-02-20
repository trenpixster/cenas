defmodule Hackathon.Router do
  use Hackathon.Web, :router

  pipeline :browser do
    plug :accepts, ["html", "json"]
    plug :fetch_session
    plug :fetch_flash
    plug :put_secure_browser_headers
  end

  pipeline :api do
    plug :accepts, ["json"]
  end

  scope "/", Hackathon do
    pipe_through :browser # Use the default browser stack

    get "/", PageController, :index
    post "/click/harvest", ClickController, :click
  end

  # Other scopes may use custom stacks.
  # scope "/api", Hackathon do
  #   pipe_through :api
  # end
end
