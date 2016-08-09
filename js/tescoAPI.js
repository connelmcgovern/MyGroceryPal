Parse.initialize("hRNDGFprtpZn3OoKXdZHivCt6ZRiNSRd4WrGI1V2", "b9F2hxfq1XG6FJUOX6ojiRxRBDw6AGTnmwvu4KDR");
var ShoppingList = Parse.Object.extend("ShoppingList");

$(document).ready(function() 
{
    $(document).on('click','#AddItem', function() //Remove item by clicking on it on the shopping list
    {
        var product = "Product Search Item";
        var price = "";
        var searchItem = "";
        var user = Parse.User.current().get("username");

        var data = $(this).parent().html();
        var itemString = JSON.stringify(data);

        var newitemString = itemString.replace("<b>", "");
        var newitemString1 = newitemString.replace("<b>", "");
        var newitemString2 = newitemString1.replace("</b>", "");
        var newitemString3 = newitemString2.replace("</b>", "");
        
        searchItem = newitemString3.match(/Product Name: (.*?)</i)[1];
        price = newitemString3.match(/Price: (.*?)</i)[1];

        var userList = new ShoppingList();
        userList.set("Item", product);
        userList.set("TescoItem", searchItem);
        userList.set("Price", price);
        userList.set("User", user);

        userList.save// save the input on Parse
        ({
            success: function()
            {
                alert("Item added to Personal Shopping List!");
            }, 
            error: function(error)
            {
                console.log("Parse error:" + error);
            }
        });
    });

    $("#search").click(function() 
    {
        var x = 0
        while(x < 20)//loop to clear all populated divs if a second search is made before the page is re-loaded
        {
            $("#displayProduct"+x).empty();
            x++;
        }

        var product = $("#input-product").val();
        //console.log("Input Product: " + product);
        
        var amount = $("#input-amount").val();
        //console.log("Input Amount: " + amount);
        
        var i = 0;
        var image = [];
        var name = [];
        var price = [];
        var description = [];

        if(product == "")
        {
            alert("Product Search cannot be null");
        }   
        else
        {
            $.getJSON(
            "https://dev.tescolabs.com/grocery/products/?query="+product+"&offset=0&limit="+amount+"&Subscription-Key=774b7555718d47f8b588d6274d0acde0", 
            function(data,status)
            {
                    if(status == "success")
                    { 
                        $.each(data.uk.ghs.products.totals, function(key1, value1)
                        {
                            if(key1 == "all" && value1 == "0")
                            {
                                alert("Unfortunately, there are no results matching your current product search. Please try again.");
                            }
                        });

                        $.each(data.uk.ghs.products.results, function(key1, value1)
                        {
                            if(key1 == i)
                            {
                                $.each(value1, function(key2, value2)
                                {
                                    //console.log("Key 2: "+JSON.stringify(key2));
                                    //console.log("Value 2: "+JSON.stringify(value2));
                                    
                                    if(key2=="name")
                                    {
                                        name[i] = value2;
                                    }
                                    else if(key2 == "price")
                                    {
                                        price[i] = value2 * 1.29;// API returns in £ (*1.29 to exchange to €)
                                        price[i] = price[i].toFixed(2);                                        
                                    }
                                    else if(key2 == "image")
                                    {
                                        image[i] = value2;                                        
                                    }
                                    else if(key2 == "description")
                                    {
                                        description[i]= value2;
                                    }
                                    $("#displayProduct"+i).html("<img src='"+image[i]+"' style='float:left' hspace='20' vspace='20'> <br><b>Product Name: </b>"+name[i]+"<br><b> Price: </b>"+price[i]+"<br> <b>Description: </b>"+description[i]+"<br><button id='AddItem'style='float:right' class='w3-btn w3-blue w3-round-xxlarge'> Add to Shopping List </button><br></br>");
                                });
                            i = i + 1;
                            }
                        });
                        $("#SearchHeading").html("<h4><b>Search Results for:</b> '"+product+"'</h4>");
                    }

            });
        }
    });
});