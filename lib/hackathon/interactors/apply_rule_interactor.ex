defmodule Hackathon.ApplyRuleInteractor do
  alias Hackathon.SendDataToGoogleAnalyticsInteractor

  def call(action, model) do
    v = 1
    IO.puts "doing ec:"
    ec = extract_values(action["category"], model)
    IO.puts "doing ea:"
    ea = extract_values(action["action"], model)
    IO.puts "doing el:"
    el = extract_values(action["label"], model)
    IO.puts "doing ev:"
    ev = String.to_integer(extract_values(action["value"], model))
    cid = model.cid
    tid = get_tid_from_user(model.nfa_id)
    SendDataToGoogleAnalyticsInteractor.call(v, ec, ea, el, ev, cid, tid)
  end

  defp get_tid_from_user(user_id) do
    user = Hackathon.Repo.get_by Hackathon.User, id: user_id
    user.tid
  end

  defp extract_values(map, model) do
    case map["type"] do
      "fixed" -> map["value"]
      "dynamic-attribute" -> model.payload["attrs"][map["value"]]
      "location-path" -> extract_url_fragment(model.url, String.to_integer(map["value"]))
      "location-query" -> extract_query_param_value(model.url, map["value"])
      "href-path" -> extract_url_fragment(model.payload["clickableLink"], String.to_integer(map["value"]))
      "href-query" -> extract_url_fragment(model.payload["clickableLink"], map["value"])
    end
  end

  defp extract_query_param_value(url, query_parameter) do
    ret = ""
    String.split(url, "?")
    |> Enum.at(1)
    |> Enum.split("&")
    |> Enum.each fn(el) ->
      cur_query_parameter = String.split(el, "=") |> Enum.at(0)
      cur_query_value = String.split(el, "=") |> Enum.at(1)
      if query_parameter == cur_query_parameter do
        ret = cur_query_value
      end
    end
    ret
  end

  defp extract_url_fragment(url, chunk) do
    url = String.replace(url, "://", "")
    |> String.split("/")
    url = url
    |> Enum.slice(1, Enum.count(url))
    |> Enum.at(chunk)
    url = (url || "")
    |> String.split("#")
    |> Enum.at(0)
    |> String.split("?")
    |> Enum.at(0)
    |> String.split(".")
    |> Enum.at(0)
  end

end
