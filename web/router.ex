defmodule Hackathon.Router do
  use Hackathon.Web, :router

  pipeline :browser do
    plug :accepts, ["html", "json"]
    plug :fetch_session
    plug :fetch_flash
    plug CORSPlug
  end

  pipeline :api do
    plug :accepts, ["json"]
  end

  scope "/", Hackathon do
    pipe_through :browser # Use the default browser stack

    get "/", PageController, :index
    get "/clicks/:id", ClickController, :show
    get "/clicks", ClickController, :index
    post "/click", ClickController, :click
    options "/click", ClickController, :wtf
    options "/", ClickController, :wtf
  end

  # Other scopes may use custom stacks.
  # scope "/api", Hackathon do
  #   pipe_through :api
  # end
end
