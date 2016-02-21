defmodule Hackathon.MatchRulesInteractor do
  alias Hackathon.Repo
  alias Hackathon.Rule
  alias Hackathon.ApplyRuleInteractor
  require Logger

  def call(model, cid) do
    IO.puts "MatchRulesInteractor spawned!"
    Repo.all(Rule)
    |> Enum.map fn(rule) -> spawn Hackathon.MatchRulesInteractor, :process_rule, [model, rule, rule.trigger["location_only"]] end
  end

  def process_rule(model, rule, true) do
    if is_same_location(rule.trigger["location"], model.url) do
      process_rule(model, rule, false)
    else
      Logger.debug "Location did not match! #{rule.trigger["location"]} != #{model["url"]}"
    end
  end

  def process_rule(model, rule, false) do
    rules = rule.trigger["rules"]
    action = rule.action["payload"]
    is_and = rule.trigger["logic_operator"] == "and"

    should_apply_rule = validate_rule(model, rules, is_and)
    apply_rule(should_apply_rule, action, model)
  end

  defp is_same_location(location1, location2) do
    if String.starts_with? location1, location2 do
      if String.length location1 == String.length location2 do
        true
      else
        case String.replace(location2, location1, "") |> String.at(0) do
          "?" -> true
          "#" -> true
          _ -> false
        end
      end
    end
  end

  defp apply_rule(false, _, _) do
    Logger.info "Will NOT apply rule"
  end

  defp apply_rule(true, action, model) do
    Logger.info "Will apply rule"
    #Repo.delete model
    ApplyRuleInteractor.call(action, model)
  end

  defp validate_rule(model, rules, is_and) do
    IO.puts "validate_rule"
    rules = rules |> Enum.map fn(rule) ->
      has_attribute = Map.has_key?(model.payload["attrs"], rule["attribute"])
      #IO.puts "has_attribute: #{has_attribute} " <> model.payload["attrs"] <> "  " <> rule["attribute"]
      #IO.puts "operator: " <> rule["operator"]
      if has_attribute do
        if rule["operator"] == "matches" do
          #IO.puts "model payload attrs [rule attribute] => " <> model.payload["attrs"][rule["attribute"]]
          #IO.puts "rule[value] " <> rule["value"]
          model.payload["attrs"][rule["attribute"]] == rule["value"]
        else
          String.contains? model.payload["attrs"][rule["attribute"]], rule["value"]
        end
      else
        false
      end
    end
    Enum.reduce(rules, is_and, fn(val, acc) ->
      if is_and do
        val && acc
      else
        val || acc
      end
    end)
  end
end
