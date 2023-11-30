function setUpOrganisationsPage() {
  // show whats new modal if first page load
  if (sessionStorage.getItem("newFeatures_flag") === null) // Check if the key is set. It's a self defined key.
    {
      sessionStorage.setItem("newFeatures_flag", 1); // If not set, set it
      const whatsNewModal = $('#latest-changes-modal');
      whatsNewModal.modal('show');
    }

  let newGroupColor, newGroupId;

  function generateNewGroup () {
    newGroupColor = `hsl(${Math.floor(Math.random() * 361)}, 40%, 85%)`;
    $('button.create-group label').css('background-color', newGroupColor)
    newGroupId = self.crypto.randomUUID();
  }

  generateNewGroup();

  // allows use of show/hide event
  (function ($) {
	  $.each(['show', 'hide'], function (i, ev) {
	    var el = $.fn[ev];
	    $.fn[ev] = function () {
	      this.trigger(ev);
	      return el.apply(this, arguments);
	    };
	  });
	})(jQuery);

  if (!$('.assessment-header--organisation-action').length) return
  $('#profile-delete').on('click', function () {
    return confirm("Are you sure? \nThis action cannot be undone")
  })
  $('.action-delete').on('click', function () {
    return confirm("Are you sure? \nThis action cannot be undone")
  })

  $('.actions-filter button').on('click', function () {
    $(this).hide();
    $(`.filter label:contains(\"${$(this).text()}\")`).parent().fadeIn();
  })

  $('.nav-container-home a').on('click', function () {
    $('.loading-screen').show().find('.loading-text').text('Loading');
  });

  $('.delete-filter').on('click', function (e, timer) {
    const filter = $(this).closest('.filter');
    const label = $(filter).find('label').first();
    const input = $(filter).find('input');
    $(filter).fadeOut(timer);
    if (input.attr('type') === 'text') input.val("");
    if (input.attr('type') === 'checkbox') input.each(function() {$(this).prop('checked', false)});
    const filterName = $(label).text().split(" ")[0];
    $(`#${filterName.toLowerCase()}-filter`).trigger('input');
    $(`.actions-filter button:contains(\"${filterName}\")`).show();
  })

  function closeFilters(dropContent) {
    var dropdowns = $('.dropdown-content').filter(function() { return $(this).css("display") == "block" });
    dropdowns.map(function() {
      if (!$(this).is(dropContent)) $(this).stop(true,true).fadeToggle();
    });
  }
  $('.filters-container').children().on('click', function (e) {
    e.stopPropagation();
    if (!e.target.matches('input') &&
      !($(e.target)).parent('.filter-option').length &&
      !($(e.target)).parent('.filter-group').length &&
      !($(e.target)).hasClass('group-filter')) {
      const dropContent = $(this).find('.dropdown-content').first();
      closeFilters(dropContent);
      dropContent.stop(true,true).fadeToggle();
      $(dropContent).find('input').first().focus();
    }
  });

  function showDropdown(e, context) {
    e.stopPropagation();
    const dropContent = $(context).closest('.action-groups').find('.dropdown-content');
    closeFilters();
    if (dropContent.css('display') === 'none') {
      dropContent.stop(true,true).fadeIn().promise();
      $(dropContent).find('.search-group input').trigger('focus');
    }
  }

  $('.root-groups, .add-group').on('click', function (e) {showDropdown(e, this)});

  $('.group-filter .filter-option').on('click', function (e) {
    if ($(e.target).is('input[type="checkbox"]') ||
      $(e.target).is('label') || $(e.target).is('span') ) return;
    $(this).find('input').trigger('click');
  });

  const deleteGroup = (groupId) => {
    $('.loading-screen').show().find('.loading-text').text('Saving');

    return $.post(`groups/${groupId}/delete`)
      .done(() => {
        $('.filter-option.group-filter').filter(function () {
          return $(this).find(`label[data-id="${groupId}"]`).length;
	}).remove();
        $(`.root-groups label[data-id="${groupId}"]`).remove();
        $('.group-option').filter(function () {
          return $(this).find(`label[data-id="${groupId}"]`).length;
        }).remove();

	$('.loading-screen').hide();
      })
      .fail(() => location.reload());
  } 

  $('.group-options .options').on('click', function (e) {
    e.stopPropagation()
    if($(e.target).is('a') || $(e.target).is('i')) {
      deleteGroup($(e.target).closest('.group-option').find('label').attr('data-id'));
      return;
    }
    $(e.target).find('input').trigger('click');
  });

  function toggleFilterBorder(filter, active) {
    if (active) $(filter).css("border-color", "var(--sdg10-color");
    else $(filter).css("border-color", "lightgrey");
  }

  function addTextToFilter(filter, text) { 
    if (text !== '') text = ': ' + text;
    const label = $(filter).find('label').first();
    const filterName = label.text().split(" ")[0];
    label.text(`${filterName} ${text}`);
  }

  $('.filter').on('input', function (e) {
    const filterInput = e.target.value || ""
    const nameFilterInput = $('.filter.name-filter').find('input').val();
    const ownerFilterInput = $('.filter.owner-filter').find('input').val();
    const groupsFilterInput = $('.filter [id$=-groupfilter]:checked').map(function() {
      return $(this).val();
    }).get();

    if ($(this).hasClass('group-filter')) addTextToFilter($(this), groupsFilterInput.join(', '))
    else addTextToFilter($(this), filterInput); 

    if (filterInput === "" || ($(this).hasClass('group-filter') && groupsFilterInput.length === 0)) {
      toggleFilterBorder($(this).closest('.filter'), false);
    } else toggleFilterBorder($(this).closest('.filter'), true);

    const matches = $('.row-container').filter(function () {
      const nameFilterMatch = $(this).find('.action-title').text().includes(nameFilterInput);
      const ownerFilterMatch = $(this).find('.action-owner').text().includes(ownerFilterInput);
      const groupFilterMatch = $(this).find('.root-group.action-group').filter(function(){
        return groupsFilterInput.includes($(this).text().trim());
      }).length;

      // match should return false if filterInput is empty or don't match
      const match = (!nameFilterInput || nameFilterMatch) &&
        (!ownerFilterInput || ownerFilterMatch) && 
        (!groupsFilterInput.length || groupFilterMatch);
      return match;
    });

    $('.row-container').stop(true,true).fadeOut();
    matches.each(function() { $(this).stop(true,true).fadeIn() });
  });

  // action groups
  $('.col.action-groups .dropdown-content').on('show', function() {
    const selectedGroups = $(this).siblings().find('.root-group')
    $(this).find('input').prop('checked', false);
    selectedGroups.each(function() {
      $(this).closest('.action-groups').find(`input[data-id='${$(this).attr('data-id')}']`).prop('checked', true);
    });
  });

  $('.col.action-groups .dropdown-content').on('hide', function(e) {
    e.stopPropagation();
    if (e.target.matches('.group-option, button, label, input')) return;
    const groupOptions = $(this).find('.group-option');
    const selectedOptions = $(groupOptions).filter(function() {
      if ($(this).find('input:checked').length) return true;
    }).find('label');
    const selectedGroups = $(this).closest('.action-groups').attr('data-groups').split(',');

    if (selectedOptions.length === 0) return;

    // check if groups have changed
    for (let i = 0; i < selectedOptions.length; i++) {
      if (selectedGroups[i] !== $(selectedOptions[i]).attr("data-id")) break;
      if (i === selectedOptions.length -1) return;
    }

    const selectedIds = [];
    selectedOptions.each(function() {
      selectedIds.push($(this).data("id"))
    });

    const actionId = $(this).closest('.row-container').data("id");

    $('.loading-screen').stop(true,true).show().find('.loading-text').text('Saving');

    return $.post(`${actionId}/groups`, {groups: selectedIds})
      .done(() => {
        $(this).closest('.action-groups').attr('data-groups', selectedIds);
        $('.filter').first().trigger('input');
	$('.loading-screen').hide()
      })
      .fail(() => location.reload());
  })

  // add and remove group on checkbox change
  $('.action-groups .options').on('change', ':checkbox', function(e){
    e.stopPropagation();
    const groupId = $(this).attr('data-id');
    const rootGroups = $(this).closest('.action-groups').find('.root-groups');

    if (this.checked) {
      const groupLabel = $(this).siblings('label');
      groupLabel.clone(false)
        .removeAttr('for', '')
        .removeAttr('id', '')
        .insertBefore($(rootGroups).find('button'))
        .on('click', function (e) {showDropdown(e, this)})
        .addClass('root-group');
    } else {
      $(this).closest(`.action-groups`)
        .find(`.root-groups label[data-id="${groupId}"]`)
        .remove();
    }
  });

  $('.search-group').on('input', function (e) {
    e.stopPropagation();
    const searchText = $(this).find('input').val().trim();
    
    const createGroup = $(this).siblings('.create-group');
    createGroup.stop(true, true).fadeOut();

    const matches = $(this).siblings('.options').find(`.group-option:contains(${searchText})`);
    const exactMatches = matches.filter(function () {
      return $(this).find('label').text() === searchText; 
    });

    $(this).siblings('.options').find('.group-option').stop(true, true).fadeOut();
    $(matches).stop(true, true).fadeIn();

    if (searchText.length && !exactMatches.length) {
      
      $(createGroup).find('.new-group')
        .text(searchText);
      createGroup.stop(true, true).fadeIn();
    }
  });

  $('button.create-group.submit').on('click', function () {
    const searchBox = $(this).siblings('.search-group').find('input');
    const newGroupName = searchBox.val();

    $('.loading-screen').show().find('.loading-text').text('Saving');

    return $.post('groups/create', {group: {id: newGroupId, color: newGroupColor, name: newGroupName}})
      .done(() => {
	const newGroupElm = $(this).siblings('.options').find('.group-option').first().clone(true)

        $('.group-options .options').filter(function () {
    	  const actionId = $(this).closest('.row-container').data('id');

	  $(newGroupElm).find('input, label').attr('data-id', newGroupId);
          $(newGroupElm).find('label')
            .attr('for', `${newGroupName}-group-${actionId}`)
	          .attr('id', `${newGroupName}-label-${actionId}`)
            .css('background-color', newGroupColor)
            .find('span')
              .text(newGroupName)
              .attr('title', newGroupName);
          $(newGroupElm).find('input')
            .prop('checked', true)
            .attr('aria-label', newGroupName)
            .attr('id', `${newGroupName}-group-${actionId}`)
            .val(newGroupName);

          $(this).append($(newGroupElm).clone(true).removeClass('hidden'));;
	});
        $(this).siblings('.options').find('.group-option').last().find('input').trigger('change');

        //create element for filter
        const newFilterEml = $('.filter-option.group-filter').first().clone(true);
        $(newFilterEml).find('label')
          .attr('for', `${newGroupName}-groupfilter`)
	        .attr('data-id', newGroupId)
          .css('background-color', newGroupColor)
          .text(newGroupName);
        $(newFilterEml).find('input')
          .attr('id', `${newGroupName}-groupfilter`)
          .val(newGroupName);
	$(newFilterEml).find('input').prop('checked', false)
        $('.group-filter .filter-options').append($(newFilterEml).removeClass('hidden'));

        searchBox.val("")
        searchBox.focus();
        searchBox.trigger('input');
        generateNewGroup();

	$('.loading-screen').hide()
      })
      .fail(() => location.reload());
  });

  window.onclick = function(e) {
    if (!e.target.matches('input') && 
      !$(e.target).parent('.filter-option').length &&
      !$(e.target).hasClass('group-option') &&
      !$(e.target).hasClass('action-group') &&
      !$(e.target).hasClass('delete-group') &&
      !$(e.target).is('.delete-group i') &&
      !$(e.target).hasClass('filters-container')) {
      closeFilters();
    }
  }

  if ($('#name-filter').val() === "") $('.name-filter .delete-filter').trigger('click', [0]);
  else $('#name-filter').trigger('input');
  if ($('#owner-filter').val() === "") $('.owner-filter .delete-filter').trigger('click', [0]);
  else $('#owner-filter').trigger('input');
  if ($('.filter [id$=-group]:checked').length === 0) $('.group-filter .delete-filter').trigger('click', [0]);
  else $('.group-filter').trigger('input');
}

function setUpDashboardFilter() {
  const searchParams = new URLSearchParams(window.location.search);
  const groupIds = searchParams.get('groups');

  if (!groupIds) return;

  $(`.group-filter input`).prop('checked', false);
  
  groupIds.split(',').map(groupId => {
    $(`.group-filter label[data-id="${groupId}"]`).siblings('input').trigger('click');
  });
}

function dashboardFilter() {
  $('.dashboard-filter .dropdown-content').on('hide', function(e) {
    const searchParams = new URLSearchParams(window.location.search);
    const groupIds = (searchParams.get('groups') || "").split(',');

    const groupsFilterInput = $('.filter [id$=-groupfilter]:checked').map(function() {
      return $(this).siblings('label').data('id');
    }).get();

    if (JSON.stringify(groupIds) === JSON.stringify(groupsFilterInput)) return;

    $('.loading-screen').show().find('.loading-text').text('Loading');

    const orgId = $('.orgId').data('orgid');
    const encodedGroupFilterInput = groupsFilterInput.map(input => encodeURIComponent(input));
    const query = '?groups=' + encodedGroupFilterInput.join(',');

    const url = "/app/" + orgId + "/dashboard" + query;
    window.location.href = url;
  });
}

function setUpInfoForm() {
  if (!$('#actionInfoForm').length) return;
  const isEdit = $('input[name=isEdit]').val();
  
  $(document).ready(function() {
    // populate multiline existing data
    if (isEdit) { 
      $('#actionOwnerType').selectpicker('val', $('#actionOwnerType').data().values.split(','));
      $('#actionType').selectpicker('val', $('#actionType').data().values.split(','));
      $('#actionStatus').selectpicker('val', $('#actionStatus').data().values);
      $('#actionLocation').selectpicker('val', $('#actionLocation').data().values.split(','));
    }

    // text box characters
    $("#actionOverviewLength").html((1000 - $("#actionOverview").val().length) + " characters");
    $("#actionObjectivesLength").html((1000 - $("#actionObjectives").val().length) + " characters");
    $("#actionOverview").keyup(function() {
      $("#actionOverviewLength").html((1000 - this.value.length) + " characters");
    });
    $("#actionObjectives").keyup(function() {
      $("#actionObjectivesLength").html((1000 - this.value.length) + " characters");
    });
  });
}

function updateTagTabs() {
  let lastId;
  const contentSections = $('a.tag-group-anchor');
  const topMenu = $('.tabs-container');
  const topMenuHeight = topMenu.outerHeight();

  $('.nav-container a').on('click', function (e) {
    e.preventDefault();
    const tagGroup = $(this).text().toLowerCase();
    $(`.tag-group[data=${tagGroup}]`).find('input').first().focus();
  });

  $(window).scroll(function() {
    // Get container scroll position
    const fromTop = $(this).scrollTop() + topMenuHeight;

    // Get id of current scroll item
    let cur = contentSections.map(function() {
      if ($(this).offset().top < fromTop) return this;
    });

    // Get the id of the current element
    cur = cur[cur.length - 1];
    const id = cur && cur.id ? cur.id : '';

    if (id && lastId !== id) {
      lastId = id;

      $('a.tab')
        .removeClass('active');
      $(`#tab-${id}`)
        .addClass('active');
    }
  });
}

function onTagScroll() {
  updateTagTabs();
}

function onTagHover() {
  $(document).ready(function() {
    $('[data-toggle="tooltip"]').tooltip({ trigger: 'hover' });
  });
}

class InputInvalid extends Error {
  constructor(validationMsg, invalidField, fieldContainer) {
    super(validationMsg, invalidField, fieldContainer);
    this.name = this.constructor.name;
    this.message = validationMsg;
    this.field = invalidField;
    this.container = fieldContainer;
  }
}

$(document).on('InvalidInputEvent', (e, domField) => {
  const errorField = $(domField);
  if (errorField.hasClass('is-invalid')) {
    errorField.on('click', () => {
      errorField.removeClass('is-invalid');
      errorField.nextAll('.invalid-feedback').remove();
    });
  }
});

function infoValidation() {
  let isValid = true;
  $('.action-info-input:not(.action-info-input .action-info-input)').each(function() {
    try {
      if (!$(this).hasClass("dropdown") && !$(this).val()) {
        throw new InputInvalid('Cannot be left blank', $(this), $(this).parent());
      } else if ($(this).hasClass("dropdown")
        && !$(this).find($("li.selected")).length) {
        throw new InputInvalid('Please choose one', $(this), $(this).parent());
      }
    } catch (err) {
      isValid = false;
      if (err.container.find(".invalid-feedback").length !== 1) {
        err.field.addClass('is-invalid');
        err.container.append(`<div class="invalid-feedback px-1">${err.message}</div>`);
        $(document).trigger('InvalidInputEvent', err.field);
      }
    }
  });
  $('html').animate({scrollTop:$('.is-invalid').first().offset().top-2*$('.assessment-header').height()},500);
  return isValid;
}

function onActionInfoFormSubmit() {
  if (document.getElementById('actionInfoForm')) {
    const actionInfoForm = document.getElementById('actionInfoForm');
    actionInfoForm.addEventListener('submit', (event) => {
      if (actionInfoForm.checkValidity() === false) {
        if (!infoValidation()) event.preventDefault();
      }
      actionInfoForm.classList.add('was-validated');
    }, false);
  }
}

function onTagFormSubmit() {
  if (document.getElementById('tags-form')) {
    // propogate selected tags
    const selecedTags = $('#tags-section').data().values.split(',');
    selecedTags.forEach(tag => $(`#${tag}`).prop('checked', true));

    const tagForm = document.getElementById('tags-form');
    tagForm.addEventListener('submit', (event) => {
      if (!$('input:checkbox').is(':checked')) {
        alert('Please select at least one tag.');
        event.preventDefault();
        event.stopPropagation();
      }
      tagForm.classList.add('was-validated');
    }, false);
  }
}

function setSelectedActionsCounter(actionContainer) {
  const counter = actionContainer.closest('.target-container').getElementsByClassName('selected-action-count')[0];

  counter.innerHTML = 
    actionContainer.querySelectorAll('input:checked').length +
    actionContainer.querySelectorAll('.custom-action-container:not([hidden])').length +
    ' actions selected';
}

function onTargetFormLoad() {
  const actionsContainer = [].slice.call(document.getElementsByClassName('target-actions-row'));

  actionsContainer.map((actionContainer) => {
    setSelectedActionsCounter(actionContainer);
    actionContainer.addEventListener('click', (event) => {
      if (event.target.type !== 'checkbox' && event.target.type !== 'submit') return;
      setSelectedActionsCounter(actionContainer);
    })
  });
}

function deleteCustomAction(event, {btn}) {
  event.preventDefault();
  const numberOfCustomActions = btn.closest('.target-actions-row').getElementsByClassName('custom-action-container').length;
  const currentAction = btn.closest('.custom-action-container');

  if (numberOfCustomActions < 1) return;
  else if (numberOfCustomActions === 1) {
    const actionInputs = [].slice.call(currentAction.getElementsByTagName('input'));
    const actionDescription = [].slice.call(currentAction.getElementsByTagName('textarea'));
    currentAction.hidden = true;
    actionInputs.map((input) => {
      input.disabled = true;
      input.value = '';
    });
    actionDescription[0].disabled = true;
    actionDescription[0].value = '';
  } else {
    currentAction.remove();
  };
}

function onAddCustomAction() {
  const addCustomActionBtns = [].slice.call(document.getElementsByClassName('add-custom-action'));

  addCustomActionBtns.map((btn) => btn.addEventListener('click', (event) => {
    event.preventDefault();
    const closestAction = btn.previousElementSibling;
    const actionInputs = [].slice.call(closestAction.getElementsByTagName('input'));
    const actionDescription = [].slice.call(closestAction.getElementsByTagName('textarea'));

    if (closestAction.hidden) {
      closestAction.hidden = false;
      actionInputs.map((input) => input.disabled = false);
      actionDescription[0].disabled = false;
    } else {
      const newCustomAction = closestAction.cloneNode(true);
      const newActionInputs = [].slice.call(newCustomAction.getElementsByTagName('input'));
      const newActionDescription = [].slice.call(newCustomAction.getElementsByTagName('textarea'));
      const newActionDelete = newCustomAction.getElementsByClassName('delete-custom-action')[0];

      newActionInputs.map((input) => input.value = '');
      newActionDescription[0].value = '';
      closestAction.after(newCustomAction);
      newActionDelete.addEventListener('click', (event) => {
        deleteCustomAction(event, {btn: newActionDelete})
      });
    }
  }));
}

function onDeleteCustomAction() {
  const deleteCustomActions = [].slice.call(document.getElementsByClassName('delete-custom-action'));

  deleteCustomActions.map((btn) => btn.addEventListener('click', (event) => {
    deleteCustomAction(event, {btn});
  }));
}

function onTargetFormSubmit() {
  const targetsForm = $('#targets-form');
  const isEdit = $('input[name=isEdit]').val();

  if (targetsForm.length) {
    $('.next-button').each(function() {
      $(this).on('click', function (event) {
        event.preventDefault();
        if (!$('input:checkbox').is(':checked')) {
          alert('Please select at least one target.');
          return;
        };

        if (!!!isEdit) targetsForm.submit();
        else if(confirm("Warning\n\nIf you have removed targets, continuing will delete any data you have entered for that target\n\nDo you want to continue?")) {
          targetsForm.submit();
        };
      });

      targetsForm.addClass('was-validated');
    }, false);
  }
}

function onActionPlanSelcected() {
  $('.target-plan-container .target-title-row').click(function() {
    if (($(this).next()).is(":visible")) {
	$(this).find('i').css({'transform' : 'rotate('+ 0 +'deg)'})
	$(this).next().hide()
    } else {
	$(this).find('i').css({'transform' : 'rotate('+ 90 +'deg)'})
	$(this).next().show();
    }
  })
}

function onActionPlanSubmit() {
  if (document.getElementById('action-plan-form')) {
    const actionPlanForm= document.getElementById('action-plan-form');
    actionPlanForm.addEventListener('submit', (event) => {
      if (actionPlanForm.checkValidity() === false) {
        event.preventDefault();
        const invalidElement = actionPlanForm.querySelectorAll(':invalid')[0];
        invalidElement.closest('.target-plan-row').style.display = "block";
        $('html, body').stop().animate({
          scrollTop: $(invalidElement).offset().top - (innerHeight/2),
        }, 100);
        actionPlanForm.reportValidity();
      }
    });
  }
}

function onAddKpi() {
  $('.add-kpi-button').click(function() {
    const kpiContainers = $(this).parent().find('.kpi\\-container');
    if (kpiContainers.length >= 10) return

    const kpiClone = kpiContainers.first().clone()
    kpiClone.find("input").val("");
    kpiClone.appendTo(kpiContainers.parent());
  })
}

function downloadReport() {
  $('.download-pdf-button').click(function() {
    document.title = $('.action-name').text();
    window.print();
    document.title = "SDG Tag Tool";
  })
}

function populateUserSettingModal() {
  $('.open-PermissionsEditModal').click(function() {
    const uid = $(this).data('id');

    $('.modal-body #uid').val(uid);
    $('.modal-body #role').val($(this).data('role')).change();
  })
}

function populateUserDeleteModal() {
  $('.open-deleteUserModal').click(function() {
    const uid = $(this).data('id');

    if ($(this).attr('id') === 'leave-workspace') {
      $('#deleteModalLabel').text("Leave Workspace");
      $('#delete-user-form p').text("Are you sure you want to leave?")
      $('#deleteModal .modal-footer :last-child').text("Leave")
    } else {
      $('#deleteModalLabel').text("Delete User");
      $('#delete-user-form p').text("Are you sure you want to remove this user?")
      $('#deleteModal .modal-footer :last-child').text("Delete")
    }
    $('.modal-body #uid').val(uid);
  })
}

function populateInviteDeleteModal() {
  $('.open-deleteInviteModal').click(function() {
    const id = $(this).data('id');

    $('.modal-body #id').val(id);
  })
}

function wrapLines(ctx, text, x, y, lineWidth, lineHeight) {
    var words = text.split(" ");
    var currentLine = words[0];
    var lineIndex = 1;

    for (var i = 1; i < words.length; i++) {
        var word = words[i];
        var width = ctx.measureText(currentLine + " " + word).width;
        if (lineIndex <= 1 && width < lineWidth * 0.9 || lineIndex >= 2 && width < lineWidth * 0.7) {
            currentLine += " " + word;
        } else { 
	    if (lineIndex >= 2) {
		currentLine += "..."; 
            	ctx.fillText(currentLine, x, y + lineHeight * lineIndex);
		break;
	    }
            ctx.fillText(currentLine, x, y + lineHeight * lineIndex);
	    lineIndex += 1;
            currentLine = word;
        }
    }
    ctx.fillText(currentLine, x, y + lineHeight * lineIndex);
    return lineIndex;
}

function drawGoalsPost() {
  // Read data
  const {
    title, description,
    actionName,
  } = document.getElementById('goals-post-canvas').dataset;
  let { selectedGoals } = document.getElementById('goals-post-canvas').dataset;
  selectedGoals = selectedGoals.split(',');

  // Content
  const post = {
    title,
    description,
  };

  // Instantiate the canvas object
  const canvas = document.getElementById('goals-post-canvas');
  const context = canvas.getContext('2d');

  // Display Size
  canvas.style.width = '360px';
  canvas.style.height = '360px';

  // Resolution
  const width = 1200;
  const height = 1200;
  canvas.width = width;
  canvas.height = height;

  // Background
  context.fillStyle = '#16161d';
  context.fillRect(0, 0, width, height);

  // Text
  context.textAlign = 'center';
  context.fillStyle = '#fff';

  context.font = "bold 40pt 'Poppins'";
  const linesWritten = wrapLines(context, post.title, width * 0.5, height * 0.83, width, 65);

  context.font = "30pt 'Poppins'";
  context.fillText(post.description, width * 0.5, height * 0.88 + linesWritten * 65);

  // Logo
  const logoSize = width * 0.08;
  const logo = document.getElementById('logo');
  context.drawImage(logo, width * 0.9, height * 0.9, logoSize, logoSize);

  // Goal Icons
  const goalSize = width * 0.15;
  const maxGoalsInRow = 5;
  const numberOfRows = Math.floor((selectedGoals.length - 1) / maxGoalsInRow);

  let marginLeft;
  if (selectedGoals.length >= maxGoalsInRow) {
    marginLeft = (width - (5 * goalSize)) / 2;
  } else {
    marginLeft = (width - (selectedGoals.length * goalSize)) / 2;
  }

  const marginTop = (((height * 0.75) - goalSize) - (numberOfRows * goalSize)) / 2;

  for (let i = 0; i < selectedGoals.length; i += 1) {
    const row = Math.floor(i / maxGoalsInRow);
    const column = i % maxGoalsInRow;
    const sdgImage = document.getElementById(`goal${selectedGoals[i]}-image`);
    context.drawImage(sdgImage,
      (goalSize * column) + marginLeft, (goalSize * row) + marginTop, goalSize, goalSize);
  }
}

function onGoalsClick() {
  $('#goals-header').click(function() {
    const canvas = document.getElementById('goals-post-canvas');
    drawGoalsPost();
    const image = canvas.toDataURL();
    drawGoalsPost();
    document.getElementById('download-goals-post-link').href = image;
  });
}

function drawGoalPost() {
  // Read data
  const {
    title, description, goal,
  } = document.getElementById('goal-post-canvas').dataset;

  // Content
  const post = {
    title,
    description: `${description} ${goal}`,
  };

  // Instantiate the canvas object
  const canvas = document.getElementById('goal-post-canvas');
  const context = canvas.getContext('2d');

  // Display Size
  canvas.style.width = '360px';
  canvas.style.height = '360px';

  // Resolution
  const width = 1200;
  const height = 1200;
  canvas.width = width;
  canvas.height = height;

  // Background
  context.fillStyle = '#16161d';
  context.fillRect(0, 0, width, height);

  // Text
  context.textAlign = 'center';
  context.fillStyle = '#fff';

  context.font = "bold 40pt 'Poppins'";
  const linesWritten = wrapLines(context, post.title, width * 0.5, height * 0.83, width, 65);

  context.font = "30pt 'Poppins'";
  context.fillText(post.description, width * 0.5, height * 0.88 + linesWritten * 65);

  // Logo
  const logoSize = width * 0.08;
  const logo = document.getElementById('logo');
  context.drawImage(logo, width * 0.9, height * 0.9, logoSize, logoSize);

  // SDG Image
  const imageSize = width * 0.5;
  const sdgImage = document.getElementById(`goal${goal}-image`);
  context.drawImage(sdgImage,
    width * 0.5 - (imageSize / 2), height * 0.15, imageSize, imageSize);
}

function onGoalClick() {
  $('.goal-image-container').click(function() {
    const goal = $(this).data('id');
    const canvas = document.getElementById('goal-post-canvas');
    canvas.setAttribute('data-goal', goal);
    drawGoalPost();
    const image = canvas.toDataURL();
    document.getElementById('download-goal-post-link').href = image;
  });
}

function drawWheelPost() {
  // Read data
  const {
    title, description,
  } = document.getElementById('wheel-post-canvas').dataset;

  // Content
  const post = {
    title,
    description,
  };

  // Instantiate the canvas object
  const canvas = document.getElementById('wheel-post-canvas');
  const context = canvas.getContext('2d');

  // Display Size
  canvas.style.width = '360px';
  canvas.style.height = '360px';

  // Resolution
  const width = 1200;
  const height = 1200;
  canvas.width = width;
  canvas.height = height;

  // Background
  context.fillStyle = '#16161d';
  context.fillRect(0, 0, width, height);

  // Text
  context.textAlign = 'center';
  context.fillStyle = '#fff';

  context.font = "bold 40pt 'Poppins'";
  const linesWritten = wrapLines(context, post.title, width * 0.5, height * 0.83, width, 65);

  context.font = "30pt 'Poppins'";
  context.fillText(post.description, width * 0.5, height * 0.88 + linesWritten * 65);

  // Logo
  const logoSize = width * 0.08;
  const logo = document.getElementById('logo');
  context.drawImage(logo, width * 0.9, height * 0.9, logoSize, logoSize);

  const paths = $('#sdgWheel path');
  const texts = $('#sdgWheel text');
  const images = $('#sdgWheel image');

  for (let i = 0; i < paths.length; i += 1) {
    const parentPath = new Path2D();
    const path2D = new Path2D($(paths[i]).attr('d'));
    const m = new DOMMatrix();
    m.a = 1; m.b = 0;
    m.c = 0; m.d = 1;
    m.e = width * 0.5; m.f = height * 0.4;
    parentPath.addPath(path2D, m);
    context.strokeStyle = $(paths[i]).css('stroke');
    context.stroke(parentPath);
    context.globalAlpha = $(paths[i]).css('fill-opacity');
    context.fillStyle = $(paths[i]).css('fill');
    context.fill(parentPath);
    context.globalAlpha = 1;
  }

  context.font = "7pt 'Poppins'";
  context.fillStyle = '#000';
  for (let i = 0; i < texts.length; i += 1) {
    if ($(texts[i]).parent().hasClass('selectedTarget')) {
      context.translate($(texts[i]).data('translateX') + (width * 0.5), $(texts[i]).data('translateY') + (height * 0.4));
      context.rotate($(texts[i]).data('rotate') * (Math.PI / 180));
      context.fillText($(texts[i]).text(), 0, 3.5);
      context.setTransform(1, 0, 0, 1, 0, 0);
    }
  }

  for (let i = 0; i < images.length; i += 1) {
    context.translate(Number($(images[i]).parent().attr('x')) + (width * 0.5), Number($(images[i]).parent().attr('y')) + (height * 0.4));
    context.rotate($(images[i]).data('rotate') * (Math.PI / 180));
    context.drawImage(images[i], $(images[i]).attr('x'), $(images[i]).attr('y'), $(images[i]).attr('width'), $(images[i]).attr('height'));
    context.setTransform(1, 0, 0, 1, 0, 0);
  }
}

function onWheelHeaderClick() {
  $('#wheel-header').click(() => {
    const canvas = document.getElementById('wheel-post-canvas');
    drawWheelPost();
    const image = canvas.toDataURL();
    document.getElementById('download-sdg-wheel-post-link').href = image;
  });
}

function onWheelClick() {
  $('#sdgWheel').click(() => {
    const hoveredElements = $(':hover');
    const lowestHovered = hoveredElements[hoveredElements.length - 1];
    if ($(lowestHovered).is('path')) {
      if ($(lowestHovered).parent().hasClass('selectedTarget')) {
        $(lowestHovered).css('fill-opacity', 0.7);
      }
    }
    const canvas = document.getElementById('wheel-post-canvas');
    drawWheelPost();
    const image = canvas.toDataURL();
    document.getElementById('download-sdg-wheel-post-link').href = image;
  });
}

function getLines(ctx, text, maxWidth) {
  const words = text.split(' ');
  const lines = [];
  let currentLine = words[0];

  for (let i = 1; i < words.length; i += 1) {
    const word = words[i];
    const { width } = ctx.measureText(`${currentLine} ${word}`);
    if (width < maxWidth) {
      currentLine += ` ${word}`;
    } else {
      lines.push(currentLine);
      currentLine = word;
    }
  }
  lines.push(currentLine);
  return lines;
}

function drawTargetPost() {
  // Read data
  const {
    actionName, targetId, targetTitle,
  } = document.getElementById('target-post-canvas').dataset;

  // Content
  const post = {
    title: actionName,
    description: `contributes to SDG target ${targetId}`,
    targetTitle: `"${targetTitle}"`,
  };

  // Instantiate the canvas object
  const canvas = document.getElementById('target-post-canvas');
  const context = canvas.getContext('2d');

  // Display Size
  canvas.style.width = '360px';
  canvas.style.height = '360px';

  // Resolution
  const width = 1200;
  const height = 1200;
  canvas.width = width;
  canvas.height = height;

  // Background
  context.fillStyle = '#16161d';
  context.fillRect(0, 0, width, height);

  // Text
  context.textAlign = 'center';
  context.fillStyle = '#fff';

  const targetTitleLines = getLines(context, post.targetTitle, 200);
  for (let i = 0; i < targetTitleLines.length; i += 1) {
    context.font = "30pt 'Poppins'";
    context.fillText(targetTitleLines[i], width * 0.5, height * 0.6 + (height * (i * 0.05)));
  }

  context.font = "bold 40pt 'Poppins'";
  const linesWritten = wrapLines(context, post.title, width * 0.5, height * 0.83, width, 65);

  context.font = "30pt 'Poppins'";
  context.fillText(post.description, width * 0.5, height * 0.88 + linesWritten * 65);

  // Logo
  const logoSize = width * 0.08;
  const logo = document.getElementById('logo');
  context.drawImage(logo, width * 0.9, height * 0.9, logoSize, logoSize);

  // Target Image
  const imageSize = width * 0.4;
  const targetImage = document.getElementById(`target-${targetId}-image`);
  context.drawImage(targetImage,
    width * 0.5 - (imageSize / 2), height * 0.15, imageSize, imageSize);
}

function onTargetClick() {
  $('.profile-target-image-container').click(function() {
    const targetId = $(this).data('targetId');
    const targetTitle = $(this).data('targetTitle');
    const canvas = document.getElementById('target-post-canvas');
    canvas.setAttribute('data-target-id', targetId);
    canvas.setAttribute('data-target-title', targetTitle);
    drawTargetPost();
    const image = canvas.toDataURL();
    document.getElementById('download-target-post-link').href = image;
  });
}

document.addEventListener('DOMContentLoaded', () => {
  setUpOrganisationsPage();
  if ($('.dashboard-filter').length) {
    setUpDashboardFilter();
    dashboardFilter();
  }
  setUpInfoForm();
  if ($('#tags-section').length) {
    onTagScroll();
    onTagHover();
  }
  onActionPlanSelcected();
  onActionPlanSubmit();
  onActionInfoFormSubmit();
  onAddKpi();
  downloadReport();
  onTagFormSubmit();
  if ($('#targets-section').length) {
    onTargetFormLoad();
    onAddCustomAction();
    onDeleteCustomAction();
    onTargetFormSubmit();
  }
  populateUserSettingModal();
  populateUserDeleteModal();
  populateInviteDeleteModal();
  if ($('#sdgWheel').length) {
    onGoalsClick();
    onGoalClick();
    onWheelHeaderClick();
    onWheelClick();
    onTargetClick();
  }
});
