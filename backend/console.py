from services.trip_service import calculate_daily_budget, get_trip_category, transport_recommendation, get_user_input, get_travel_season, get_recommended_places

# Hardcoded value for testing :)
destination_list = ["Japan", "Korea", "Indonesia"]
country          = "Japan"
days             = 5
budget           = 1100
currency         = "USD"
travel_style     = "Backpacker"
travel_month     = "December"
hotel_cost       = 100
transport_cost   = 200
food_cost        = 300
misc_cost        = 400

# Uncommenct to get user input  :P
# destination_list, country, days, budget, currency, travel_style, travel_month, hotel_cost, transport_cost, food_cost, misc_cost = get_user_input()

def print_trip_summary(
    destination_list,
    country,
    days,
    budget,
    currency,
    travel_style,
    travel_month,
    hotel_cost,
    transport_cost,
    food_cost,
    misc_cost
):
    total = sum([hotel_cost, transport_cost, food_cost, misc_cost])
    daily_budget = calculate_daily_budget(budget, days)
    category = get_trip_category(budget)
    transportation = transport_recommendation(category)
    destination = ", ".join(destination_list)
    remaining_budget = budget - total
    season = get_travel_season(travel_month)

    print("=" * 32)
    print("KelanaAI")
    print("=" * 32)
    print(f"Destination : {destination}")
    print(f"Country     : {country}")
    print(f"Days        : {days}")
    print(f"Budget      : {budget} {currency}")
    print(f"Currency    : {currency}")
    print(f"Travel Month: {travel_month}")
    print(f"Season      : {season}")
    print("=" * 32)
    print()
    print(f"Hotel Cost: {hotel_cost}")
    print(f"Transportation Cost: {transport_cost}")
    print(f"Food Cost: {food_cost}")
    print(f"Miscellaneous Cost: {misc_cost}")
    print()
    print("=" * 32)
    print("Cost Breakdown")
    print("=" * 32)
    print(f"Hotel Cost: {hotel_cost}")
    print(f"Transportation Cost: {transport_cost}")
    print(f"Food Cost: {food_cost}")
    print(f"Miscellaneous Cost: {misc_cost}")
    print("=" * 32)
    print(f"Total Estimated Cost: {total}")
    
    if remaining_budget >= 0:
        print(f"Budget is sufficient. Remaining budget: {remaining_budget} {currency}")
    else:
        print(f"Budget exceeded by: {abs(remaining_budget)} {currency}")
    
    print(f"Travel Category: {category}")
    print(f"Recommended Transportation: {transportation}")
    print(f"Daily Budget: {daily_budget} {currency}/day")
    print()
    print("=" * 32)
    print("Recommended Places")
    print("=" * 32)
    print()
    
    get_recommended_places(destination_list)
    
    print("=" * 32)
    print(f"{category}  {daily_budget} {currency}/day")
    print("=" * 32)

# Call it with any trip
print_trip_summary(
destination_list,
country,
days,
budget,
currency,
travel_style,
travel_month,
hotel_cost,
transport_cost,
food_cost,
misc_cost,
)
