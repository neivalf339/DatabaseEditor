
document.addEventListener('DOMContentLoaded', function () {
    const myModal = new bootstrap.Modal(document.getElementById('exampleModal'));
    const raceBonusCheck = document.getElementById("raceBonusCheck");
    const raceBonusAmt = document.getElementById("raceBonusAmt");
    const raceBonusPos = document.getElementById("raceBonusPos");
    fetch("./assets/drivers.json")
        .then(response => response.json())
        .then(data => {
            const names = data.freeDrivers;

            const freeDriversContainer = document.getElementById('free-drivers');

            names.forEach(name => {
                if (name.trim() !== '') {
                    const div = document.createElement('div');
                    div.textContent = name.trim();
                    div.classList.add('free-driver'); // Agrega la clase "free-driver"
                    freeDriversContainer.appendChild(div);
                }
            });
        })
        .catch(error => console.error('Error al cargar el archivo:', error));

    raceBonusCheck.addEventListener("click", function() {
        if(raceBonusCheck.checked){
            raceBonusPos.disabled = false;
            raceBonusAmt.disabled = false;
        }
        else{
            raceBonusPos.disabled = true;
            raceBonusAmt.disabled = true;
        }
    })

    interact('.free-driver').draggable({
        inertia: true,
        listeners: {
            start(event) {
                // Se ejecuta cuando comienza el arrastre
            },
            move(event) {
                const target = event.target;
                const x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx;
                const y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;

                target.style.transform = `translate(${x}px, ${y}px)`;

                target.setAttribute('data-x', x);
                target.setAttribute('data-y', y);
            },
            end(event) {
                const target = event.target;
                const freeDrivers = document.getElementById('free-drivers');
                const freeRect = freeDrivers.getBoundingClientRect();

                const driverSpaceElements = document.querySelectorAll('.driver-space');
                driverSpaceElements.forEach(function (element) {
                    console.log(element)
                    const rect = element.getBoundingClientRect();
                    if (event.clientX >= rect.left && event.clientX <= rect.right &&
                        event.clientY >= rect.top && event.clientY <= rect.bottom) {
                        if (element.childElementCount < 1) {
                            element.appendChild(target);
                            myModal.show();
                        }
                    }
                });


                const x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx;
                const y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;

                // Verifica si el punto final del evento de soltar está dentro de los límites del div "contracted-drivers"


                // Verifica si el punto final del evento de soltar está dentro de los límites del div "free-drivers"
                if (event.clientX >= freeRect.left && event.clientX <= freeRect.right &&
                    event.clientY >= freeRect.top && event.clientY <= freeRect.bottom) {
                    // Suelta el div en el div "free-drivers"
                    freeDrivers.appendChild(target);
                }

                // Reinicia las coordenadas de arrastre
                target.style.transform = 'none';
                target.setAttribute('data-x', 0);
                target.setAttribute('data-y', 0);
            }
        }
    });
});
