$(document).on("click", "#search-btn", () => {
    const userName = $("#user").val();
    const userPass = $("#pass").val();

    setTimeout(() => {
        $.ajax({
            url: "https://api.iniad.org/api/v1/locker",
            type: "GET",
            dataType: "json",
            beforeSend: (xhr) => {
                xhr.setRequestHeader("Authorization", `Basic ${btoa(`${userName}:${userPass}`)}`)
            },
            success: (data) => {
                const LOCKER_PATTERN = /^(\d{1})(\d{1})\d{2}\d{2}/;
                const patterns = data.name.match(LOCKER_PATTERN);
                const floor = patterns[1];
                const street = patterns[2];
    
                $("#floor").text(floor);
                $("#street").text(street);
                
                const insertImg = `<img src="img/${floor}.jpg">`;

                $(".place").html(insertImg);
            },
            error: (data) => {
                console.log(data);
            }
        })
    }, 500);
});