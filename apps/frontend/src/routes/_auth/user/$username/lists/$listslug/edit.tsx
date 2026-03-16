import { zodResolver } from "@hookform/resolvers/zod";
import {
	createFileRoute,
	useNavigate,
	useRouteContext,
	useRouter,
} from "@tanstack/react-router";
import { useAtom, useAtomValue } from "jotai";
import { useEffect, useRef } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { ListItemsPreview } from "@/components/lists/custom-lists/list-items-preview";
import { ListSearchAddInput } from "@/components/lists/custom-lists/list-search-add";
import { LoadingCentered } from "@/components/loading/loading-centered";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
	Field,
	FieldContent,
	FieldDescription,
	FieldError,
	FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useListBySlug, useUpdateList } from "@/hooks/useLists";
import { editListDraftItemsAtom } from "@/lib/atoms/draft-list";
import { localeRegionAtom } from "@/lib/atoms/region";
import { m } from "@/paraglide/messages";
import { createListSchema } from "@/schemas/create-list-schema";

export const Route = createFileRoute(
	"/_auth/user/$username/lists/$listslug/edit",
)({
	component: EditListPage,
});

type EditListFormValues = z.infer<typeof createListSchema>;

function EditListPage() {
	const { username, listslug } = Route.useParams();
	const { authData } = useRouteContext({ from: "__root__" });
	const localeRegion = useAtomValue(localeRegionAtom);
	const navigate = useNavigate();
	const router = useRouter();
	const onBack = () => router.history.back();
	const updateList = useUpdateList();

	const {
		data: list,
		isLoading,
		error,
	} = useListBySlug(username, listslug, localeRegion);

	const [selectedItems, setSelectedItems] = useAtom(editListDraftItemsAtom);
	const hasInitialized = useRef(false);

	const userNameFromSession = authData?.user?.name;
	const isOwnProfile =
		userNameFromSession?.toLowerCase() === username.toLowerCase();

	const form = useForm<EditListFormValues>({
		resolver: zodResolver(createListSchema),
		mode: "onTouched",
		defaultValues: {
			name: "",
			description: "",
			visibility: "public",
			type: "unranked",
		},
	});

	useEffect(() => {
		if (!isLoading && list && !hasInitialized.current) {
			// clear any stale items first
			setSelectedItems([]);

			form.reset({
				name: list.name,
				description: list.description ?? "",
				visibility: list.visibility,
				type: list.type,
			});

			if (list.items) {
				setSelectedItems(
					list.items.map((item) => ({
						tmdbId: item.id,
						mediaType: item.mediaType,
						posterPath: item.posterPath,
						title: item.title,
						releaseDate: item.releaseDate,
						note: item.note ?? "",
					})),
				);
			}

			hasInitialized.current = true;
		}
	}, [isLoading, list, form, setSelectedItems]);

	const listType = form.watch("type");

	const handleRemoveItem = (tmdbId: number, mediaType: string) => {
		setSelectedItems(
			selectedItems.filter(
				(item) => !(item.tmdbId === tmdbId && item.mediaType === mediaType),
			),
		);
	};

	const handleReorder = (reorderedItems: typeof selectedItems) => {
		setSelectedItems(reorderedItems);
	};

	const handleUpdateNote = (
		tmdbId: number,
		mediaType: string,
		note: string,
	) => {
		setSelectedItems(
			selectedItems.map((item) =>
				item.tmdbId === tmdbId && item.mediaType === mediaType
					? { ...item, note }
					: item,
			),
		);
	};

	const onSubmit = (values: EditListFormValues) => {
		if (!list?.id) return;

		const payload = {
			...values,
			items: selectedItems.map((item, index) => ({
				tmdbId: item.tmdbId,
				mediaType: item.mediaType,
				note: item.note,
				position: values.type === "ranked" ? index + 1 : undefined,
			})),
		};

		updateList.mutate(
			{ listId: list.id, payload },
			{
				onSuccess: (data) => {
					toast.success(
						m.toast_form_update_list_success({ list_name: values.name }),
					);

					navigate({
						to: "/user/$username/lists/$slug",
						params: { username, slug: data.slug },
					});
				},
				onError: () => {
					toast.error(
						m.toast_form_update_list_error({ list_name: values.name }),
					);
				},
			},
		);
	};

	if (!isOwnProfile) {
		toast.error(m.toast_error_list_unauthorized_edit());
		navigate({
			to: "/user/$username/lists/$slug",
			params: { username, slug: listslug },
		});
		return null;
	}

	if (isLoading) {
		return <LoadingCentered />;
	}

	if (error || !list) {
		toast.error(m.toast_error_list_not_found());
		navigate({
			to: "/user/$username/lists/$slug",
			params: { username, slug: listslug },
		});
		return null;
	}

	return (
		<div className="container flex flex-col max-w-3xl px-2 gap-6">
			<Card>
				<CardHeader>
					<CardTitle>{m.edit_list_page_title()}</CardTitle>
				</CardHeader>
				<CardContent>
					<form
						onSubmit={form.handleSubmit(onSubmit)}
						className="flex flex-col gap-4"
					>
						<div className="flex flex-col lg:flex-row lg:items-start gap-4 w-full">
							<Controller
								control={form.control}
								name="name"
								render={({ field, fieldState }) => (
									<Field className="w-full lg:w-[55%]">
										<FieldLabel>{m.form_create_list_name_label()}</FieldLabel>
										<FieldContent>
											<Input {...field} autoComplete="off" />
										</FieldContent>
										<FieldError
											errors={fieldState.error ? [fieldState.error] : undefined}
										/>
									</Field>
								)}
							/>

							<Controller
								control={form.control}
								name="visibility"
								render={({ field, fieldState }) => {
									const visibilityLabel = {
										public: m.form_create_list_visibility_item_public_short(),
										limited: m.form_create_list_visibility_item_limited_short(),
										private: m.form_create_list_visibility_item_private_short(),
									}[field.value as "public" | "limited" | "private"];

									return (
										<Field className="w-full lg:w-[45%]">
											<FieldLabel>
												{m.form_create_list_visibility_label()}
											</FieldLabel>
											<FieldContent>
												<Select
													onValueChange={field.onChange}
													value={field.value}
												>
													<SelectTrigger className="w-full">
														<SelectValue>{visibilityLabel}</SelectValue>
													</SelectTrigger>
													<SelectContent>
														<SelectItem value="public">
															{m.form_create_list_visibility_item_public()}
														</SelectItem>
														<SelectItem value="limited">
															{m.form_create_list_visibility_item_limited()}
														</SelectItem>
														<SelectItem value="private">
															{m.form_create_list_visibility_item_private()}
														</SelectItem>
													</SelectContent>
												</Select>
											</FieldContent>
											<FieldError
												errors={
													fieldState.error ? [fieldState.error] : undefined
												}
											/>
										</Field>
									);
								}}
							/>
						</div>

						<Controller
							control={form.control}
							name="type"
							render={({ field }) => (
								<Field>
									<FieldContent className="flex flex-row gap-2 items-center">
										<Checkbox
											checked={field.value === "ranked"}
											onCheckedChange={(checked) =>
												field.onChange(checked ? "ranked" : "unranked")
											}
										/>
										<FieldLabel>{m.form_create_list_type_ranked()}</FieldLabel>
									</FieldContent>
									<FieldDescription>
										{m.form_create_list_type_ranked_description()}
									</FieldDescription>
								</Field>
							)}
						/>

						<Controller
							control={form.control}
							name="description"
							render={({ field, fieldState }) => (
								<Field>
									<FieldLabel>
										{m.form_create_list_description_label()}
									</FieldLabel>
									<FieldContent>
										<Textarea
											className="resize-y field-sizing-content"
											rows={4}
											{...field}
										/>
									</FieldContent>
									<FieldError
										errors={fieldState.error ? [fieldState.error] : undefined}
									/>
								</Field>
							)}
						/>

						<div className="flex flex-col gap-2">
							<div className="flex flex-col gap-2">
								<FieldLabel>{m.form_create_list_add_items_label()}</FieldLabel>
								<ListSearchAddInput draftItemsAtom={editListDraftItemsAtom} />
							</div>
						</div>
						<div className="flex w-full gap-2">
							<Button
								type="button"
								disabled={updateList.isPending}
								variant="destructive"
								onClick={() => onBack()}
								className="flex-1"
							>
								{m.form_create_list_btn_cancel()}
							</Button>
							<Button
								type="submit"
								disabled={updateList.isPending}
								className="flex-1"
							>
								{updateList.isPending
									? m.btn_updating_list()
									: m.btn_update_list()}
							</Button>
						</div>
					</form>
				</CardContent>
			</Card>

			<ListItemsPreview
				selectedItems={selectedItems}
				listType={listType}
				clearItems={() => setSelectedItems([])}
				handleRemoveItem={handleRemoveItem}
				handleUpdateNote={handleUpdateNote}
				handleReorder={handleReorder}
			/>
		</div>
	);
}
