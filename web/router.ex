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
    get "/default_user", UserController, :default_user
    post "/update_tid", UserController, :update_tid

    get "/clicks", ClickController, :index
    get "/clicks/ignored", ClickController, :index_ignored
    post "/click/ignore", ClickController, :ignore
    get "/clicks/:id", ClickController, :show
    post "/click", ClickController, :click

    post "/rule", RuleController, :create
    get "/rules", RuleController, :index

    options "/click", ClickController, :wtf
    options "/", ClickController, :wtf
  end
end
